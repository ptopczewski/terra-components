import {
    Component,
    Input,
    ElementRef,
    Inject,
    OnChanges,
    AfterViewChecked,
    SimpleChanges
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
    @Input() inputViewsPerScreen:number;
    private _isSingleComponent:boolean;
    private elementRef:ElementRef;
    private _breadCrumbsPath:string;
    
    constructor(@Inject(ElementRef) elementRef:ElementRef,
                public locale:LocaleService,
                public localization:LocalizationService)
    {
        super(locale, localization);
        this.elementRef = elementRef;
        this._breadCrumbsPath = '';
        this.inputViewsPerScreen = 3;       //default
        this.inputShowBreadcrumbs = true;   //default
    }
    
    ngAfterViewChecked()
    {
        this.onDraggableDivider();
    }
    
    ngOnChanges(changes:SimpleChanges)
    {
        if(changes["inputModules"])
        {
            setTimeout(() => this.updateViewPositions());
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
        this.updateViewPositions();
    }
    
    private updateViewPositions()
    {
        if(this.inputModules)
        {
            if(this.inputModules.length > this.inputViewsPerScreen)
            {
                for(let index = this.inputModules.length - 1; index >= 0; index--)
                {
                    if(this.inputModules.length - index < this.inputViewsPerScreen + 1)
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
                        containment: '.constraint#' + idView,
                        start: function()
                               {
                                   var startPosition = jQuery('.constraint#' + idView + ' + *').position();
                                   this.rightViewStartPosition = startPosition.left;
                               },
                        drag:  function()
                               {
                                   var dividerWidth = jQuery('.divider').width();
                                   var dividerPosition = jQuery('.divider#' + idDivider).position();
                                   var viewPosition = jQuery('.view#view_' + idView).position();
                                   var width = jQuery('.side-scroller').width();
                            
                                   // change width of left view
                                   jQuery('.view#view_' + idView)
                                       .attr({
                                                 'style': 'width: ' + Math.abs(dividerPosition.left - viewPosition.left) + 'px;'
                                             });
                            
                            
                                   // change width of right view
                                   jQuery('.constraint#' + idView + ' + *')
                                       .attr({
                                                 'style': 'left: ' + Math.abs(dividerPosition.left) + 'px;' +
                                                          'width: ' + Math.abs(width - dividerPosition.left - this.rightViewStartPosition) + 'px;'
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

