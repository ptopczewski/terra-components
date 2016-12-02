import {
    Component,
    Input,
    DoCheck,
    ElementRef,
    Inject
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
export class TerraSplitViewComponent extends Locale implements DoCheck
{
    @Input() inputModules:Array<TerraSplitViewInterface>;
    @Input() inputShowBreadcrumbs:boolean;
    private _isSingleComponent:boolean;
    private elementRef:ElementRef;
    
    constructor(@Inject(ElementRef) elementRef:ElementRef,
                public locale:LocaleService,
                public localization:LocalizationService)
    {
        super(locale, localization);
        this.elementRef = elementRef;
        this.inputShowBreadcrumbs = true;
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
        
        this.onDraggableDivider();
    }
    
    private onClick():void
    {
        this.inputModules.pop();
    }
    
    public get isSingleComponent():boolean
    {
        return this._isSingleComponent;
    }
    
    public set isSingleComponent(value:boolean)
    {
        this._isSingleComponent = value;
    }
    
    private onDraggableDivider():void
    {
        jQuery(this.elementRef.nativeElement).find('.divider').draggable({ axis: "x", containment: ".side-scroller" });
    
        this.inputModules.forEach(
            (module) =>
            {
                var idDivider = 'divider_' + module.name;
                var idView = module.name;
                var rightViewStartPosition = '';
                var rightViewStartWidth = '';
                jQuery(this.elementRef.nativeElement).find('.divider#' + idDivider).draggable({
                                                                                                  start: function()
                                                                                                         {
                                                                                                             var startPos = jQuery('.divider#' + idDivider + ' + *');
                                                                                                             var startPosition = startPos.position();
                                                                                                             this.rightViewStartPosition = startPosition.left;
    
                                                                                                             var wRight = jQuery('.divider#' + idDivider + ' + *');
                                                                                                             var rightViewWidth = wRight.width();
                                                                                                             this.rightViewStartWidth = rightViewWidth;
                                                                                                         },
                                                                                                  drag:  function()
                                                                                                         {
                                                                                                             var p = jQuery('.divider#' + idDivider);
                                                                                                             var position = p.position();
                                                                                                             var w = jQuery('.side-scroller');
                                                                                                             var width = w.width();
                                                                                                             
                                                                                                             // change width of left view
                                                                                                             jQuery(".flexible-width#" + idView).attr({
                                                                                                                                                          "style": "width: " + (position.left / width * 100) + '%'
                                                                                                                                                      });
                                                                                                             // change width of right view
                                                                                                             jQuery('.divider#' + idDivider + ' + *').attr({
                                                                                                                                                               "style": "width: " + (width - position.left - this.rightViewStartPosition) + 'px'
                                                                                                                                                           });
                                                                                                         },
                                                                                                  stop:  function()
                                                                                                         {
                                                                                                         }
                                                                                              });
            }
        )
    }
}
