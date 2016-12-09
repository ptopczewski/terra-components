import {
    Component,
    Input,
    ElementRef,
    Inject,
    OnChanges,
    OnInit,
    AfterViewInit,
    AfterViewChecked
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
export class TerraSplitViewComponent extends Locale implements OnChanges, AfterViewChecked
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
    
    ngAfterViewChecked()
    {
        this.onDraggableDivider();
    }
    
    ngOnChanges()
    {
        if(this.inputModules)
        {
            if(this.inputModules.length > 3)    // maximum number of views per screen
            {
                for(let index = this.inputModules.length - 1; index >= 0; index--)
                {
                    if(this.inputModules.length - index < 4)
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
        this.ngOnChanges();
    }
    
    private copyPath():void
    {
        this._breadCrumbsPath = '';
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
        this.inputModules.forEach(
            (module) =>
            {
                var idDivider = 'divider_' + module.name;
                var idView = module.name;
                var rightViewStartPosition = module.defaultWidth;
                
                jQuery('.divider#' + idDivider).draggable(
                    {
                        axis:        'x',
                        containment: '.view#' + idView,
                        start: function()
                               {
                                   var startPosition = jQuery('.divider#' + idDivider + ' + *').position();
                                   this.rightViewStartPosition = startPosition.left;
                               },
                        drag:  function()
                               {
                                   var dividerWidth = jQuery('.divider').width();
                                   var position = jQuery('.divider#' + idDivider).position();
                                   var width = jQuery('.side-scroller').width();
                            
                                   // change width of left view
                                   jQuery('.view#' + idView)
                                       .attr({
                                                 'style': 'width: ' + Math.abs((position.left - dividerWidth) / width * 100) + '%;'
                                             });
                            
                            
                                   // change width of right view
                                   jQuery('.divider#' + idDivider + ' + *')
                                       .attr({
                                                 'style': 'width: ' + Math.abs(width - position.left - this.rightViewStartPosition) + 'px;' +
                                                          'left: ' + Math.abs(position.left) + 'px;'
                                             });
                               },
                        stop:  function()
                               {
                                   this.rightViewStartPosition = module.defaultWidth;
                               }
                    }
                );
            }
        )
    }
}
