import {Component, ElementRef, Input} from "angular2/core"
import {LintService} from "../lint/LintService"
import {DebugService} from "../debug/DebugService";
import {HintService} from "../hint/HintService";
import {Observable} from "rxjs/Observable";
import "rxjs/add/observable/fromEventPattern";
import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/distinctUntilChanged";
import {OnDestroy} from "angular2/core";
import {OutlineService} from "../outline/OutlineService";
import {ProofObligationsService} from "../proof-obligations/ProofObligationsService";
import {WorkspaceService} from "../files/WorkspaceService";
import {EditorService} from "./EditorService";
import {File} from "../files/File";

declare var CodeMirror;

@Component({
    selector: 'editor',
    template: ''
})
export class EditorComponent implements OnDestroy {
    private codeMirror;
    private suspendedMarkings:Array = [];
    private highlightMarking;
    private file:File;

    changes$:Observable<string>;

    constructor(el:ElementRef,
                private lintService:LintService,
                private hintService:HintService,
                private debugService:DebugService,
                private editorService:EditorService) {

        this.editorService.currentFile$
            .filter(file => file !== null)
            .subscribe(file => this.load(file));

        this.codeMirror = CodeMirror(el.nativeElement, {
            lineNumbers: true,
            styleActiveLine: true,
            lineWrapping: true,
            extraKeys: {"Ctrl-Space": "autocomplete"},
            lint: {getAnnotations: (text, callback) => lintService.lint(this.file, callback), async: true},
            gutters: ["CodeMirror-linenumbers", "CodeMirror-breakpoints", "CodeMirror-lint-markers"]
        });

        // Editor changes
        this.changes$ = Observable.fromEventPattern(h => this.codeMirror.on("change", h), h => this.codeMirror.off("change", h))
            .map(cm => cm.getValue())
            .debounceTime(300)
            .distinctUntilChanged();

        this.changes$.subscribe(content => {
            this.editorService.onChange();
            this.file.write(content);
        });

        this.editorService.highlight$.subscribe(section => this.highlight(section));
        this.editorService.focus$.subscribe(line => this.focus(line));
        this.editorService.goto$.subscribe(line => this.goto(line));

        this.setupCodeCompletion();
        this.setupDebugging();
    }

    ngOnDestroy() {
        // Remove CodeMirror editor from DOM when component is destroyed.
        var element = this.codeMirror.getWrapperElement();
        element.parentNode.removeChild(element);
    }

    highlight(section:EditorSection) {
        if (this.highlightMarking) this.highlightMarking.clear();

        if (!section) return;

        this.highlightMarking = this.codeMirror.markText(
            {line: section.startLine - 1, ch: section.startPos - 1},
            {line: section.endLine - 1, ch: section.endPos - 1},
            {className: "CodeMirror-highlight"}
        )
    }

    focus(line:number) {
        // TODO: Doesn't seem to work with lines over 99
        this.codeMirror.scrollIntoView({line: line - 1, ch: 0}, 500);
    }

    private load(file:File):void {
        this.file = file;

        if (file.document !== null) {
            this.codeMirror.swapDoc(file.document);
        } else {
            file.content$
                .filter(content => content !== null)
                .take(1)
                .subscribe(content => {
                    file.document = CodeMirror.Doc(content);
                    this.load(file);
                });
        }
    }

    private setupCodeCompletion() {
        var hint = (editor, callback) => this.hintService.hint(editor, callback, this.file);
        hint.async = true;

        CodeMirror.commands.autocomplete = cm => cm.showHint({hint: hint});
    }

    private setupDebugging() {
        this.debugService.stackChanged
            .subscribe((allFrames:Array<StackFrame>) => {
                var breakedFrame = allFrames[0];
                var frames = allFrames.filter(frame => frame.$filename === this.file.path);

                this.suspendedMarkings.forEach(m => m.clear());

                if (frames.length === 0) return;

                this.focus(breakedFrame.$lineno);

                this.suspendedMarkings = frames
                    .map(frame => this.codeMirror.markText(
                        {line: frame.$lineno - 1, ch: 0},
                        {line: frame.$lineno - 1, ch: 1000},
                        {className: frame === breakedFrame ? "CodeMirror-suspended" : "CodeMirror-frame"}
                    ));
            });

        this.debugService.breakpointsChanged
            .subscribe(breakpoints => {
                this.codeMirror.clearGutter("CodeMirror-breakpoints");

                breakpoints
                    .filter(bp => bp.file === this.file)
                    .forEach(bp => {
                        var marker = document.createElement("div");
                        marker.classList.add("CodeMirror-breakpoint");
                        marker.innerHTML = "●";

                        this.codeMirror.setGutterMarker(bp.line - 1, "CodeMirror-breakpoints", marker);
                    });
            });

        this.codeMirror.on("gutterClick", (cm, line) => {
            var info = cm.lineInfo(line);

            if (info.gutterMarkers && info.gutterMarkers['CodeMirror-breakpoints'])
                this.debugService.removeBreakpoint(this.file, line + 1);
            else
                this.debugService.setBreakpoint(this.file, line + 1);
        });
    }
}