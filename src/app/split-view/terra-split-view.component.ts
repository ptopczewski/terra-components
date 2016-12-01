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
        
        jQuery(this.elementRef.nativeElement).find('.divider').draggable({ axis: "x" });
        //jQuery(this.elementRef.nativeElement).find('.divider').mousedown(function()
        //                                                               {
        //                                                                   jQuery('.side-scroller').addClass("flexible-width");
        //                                                               });
        //jQuery(this.elementRef.nativeElement).find('.divider').mouseup(function()
        //                                                             {
        //                                                                 jQuery('.side-scroller').removeClass("flexible-width");
        //                                                             });
        jQuery(this.elementRef.nativeElement).find('.divider').draggable({
                                                                             start: function()
                                                                                    {
                                                                                        
                                                                                        
                                                                                        //jQuery('.divider').each(function(elem)
                                                                                        //                        {
                                                                                        //                            elem.setStyle('side-scroller', 'width', 'auto')
                                                                                        //                        });
                                                                                    },
                                                                             drag:  function()
                                                                                    {
                                                                                        var p = jQuery( ".divider" );
                                                                                        var position = p.position();
                                                                                        //jQuery( ".side-scroller > *" ).text( "left: " + position.left + ", top: " + position.top );
                                                                                        jQuery(".flexible-width").attr({
                                                                                                           "style" : "width: " + (position.left / window.innerWidth*100)+'%'
                                                                                                       });
                                                                                    },
                                                                             stop:  function()
                                                                                    {
                                                                                        //jQuery('.divider')
                                                                                        //    .setStyle('side-scroller', 'width', '32.8%');
                                                                                    }
                                                                         });
        jQuery('.divider').position()
    
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
}
