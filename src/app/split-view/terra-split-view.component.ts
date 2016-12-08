import {
    Component,
    Input,
    ElementRef,
    Inject,
    OnChanges,
    DoCheck
} from '@angular/core';
import { TerraSplitViewInterface } from './data/terra-split-view.interface';
import {
    Locale,
    LocaleService,
    LocalizationService
} from 'angular2localization';

// declare variable to use jQuery code
declare var jQuery:any;

@Component({
               selector: 'terra-split-view',
               styles:   [require('./terra-split-view.component.scss').toString()],
               template: require('./terra-split-view.component.html')
           })
export class TerraSplitViewComponent extends Locale implements OnChanges, DoCheck
{
    
    @Input() inputModules:Array<TerraSplitViewInterface>;
    @Input() inputShowBreadcrumbs:boolean;
    private _isSingleComponent:boolean;
    private elementRef:ElementRef;
    private _breadCrumbsPath:string;
    
    constructor(@Inject(ElementRef) elementRef:ElementRef,
                public locale:LocaleService,
                public localization:LocalizationService)
    {
        super(locale, localization);
        this.elementRef = elementRef;
        this.inputShowBreadcrumbs = true;
        this._breadCrumbsPath = '';
    }
    
    
    ngDoCheck()
    {
        if(this.inputModules)
        {
            if(this.inputModules.length > 3)
            {
                for(let index = this.inputModules.length - 1; index >= 0; index--)
                {
                    if(this.inputModules.length - 1 - index < 3)
                    {
                        this.inputModules[index].hidden = false;
                    }
                    else
                    {
                        this.inputModules[index].hidden = true;
                    }
                }
            }
            else
            {
                if(this.inputModules[0])
                {
                    this.inputModules[0].hidden = false;
                }
                if(this.inputModules[1])
                {
                    this.inputModules[1].hidden = false;
                }
                if(this.inputModules[2])
                {
                    this.inputModules[2].hidden = false;
                }
            }
            
            if(this.inputModules.length == 1)
            {
                this._isSingleComponent = true;
            }
            else
            {
                this._isSingleComponent = false;
            }
        }
    }
    
    ngOnChanges()
    {
        this.onDraggableDivider();
    }
    
    public get breadCrumbsPath():string
    {
        return this._breadCrumbsPath;
    }
    
    public set isSingleComponent(value:boolean)
    {
        this._isSingleComponent = value;
    }
    
    public get isSingleComponent():boolean
    {
        return this._isSingleComponent;
    }
    
    private onClick():void
    {
        this.inputModules.pop();
    }
    
    private copyPath():void
    {
        this._breadCrumbsPath = "";
        this.inputModules.forEach
        (
            (module) =>
            {
                if(this._breadCrumbsPath == '')
                {
                    this._breadCrumbsPath += module.name;
                }
                else
                {
                    this._breadCrumbsPath += '»' + module.name;
                }
            }
        )
    }
    
    private onDraggableDivider():void
    {
        jQuery(this.elementRef.nativeElement).find('.divider').draggable({
                                                                             axis:        "x",
                                                                             containment: ".side-scroller"
                                                                         });
        this.inputModules.forEach(
            (module) =>
            {
                var idDivider = 'divider_' + module.name;
                var idView = module.name;
                jQuery(this.elementRef.nativeElement).find('.divider#' + idDivider).draggable(
                    {
                        start: function()
                               {
                                   var startPosition = jQuery('.divider#' + idDivider + ' + *').position();
                                   this.rightViewStartPosition = startPosition.left;
                               },
                        drag:  function()
                               {
                                   var position = jQuery('.divider#' + idDivider).position();
                                   var width = jQuery('.side-scroller').width();
                            
                                   // change width of left view
                                   jQuery(".view#" + idView)
                                       .attr({
                                                 "style": "width: " + Math.abs((position.left - 5) / width * 100) + '%'
                                             });
                            
                            
                                   // change width of right view
                                   jQuery('.divider#' + idDivider + ' + *')
                                       .attr({
                                                 "style": "width: " + (width - position.left - this.rightViewStartPosition) + 'px'
                                             });
                               },
                        stop:  function()
                               {
                               }
                    }
                );
            }
        )
    }
}
