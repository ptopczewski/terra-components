import {
    Component,
    Input,
    Output,
    EventEmitter,
    ViewEncapsulation
} from '@angular/core';

@Component({
               selector:      'terra-button',
               styles:        [require('./terra-button.component.scss').toString()],
               template:      require('./terra-button.component.html'),
               encapsulation: ViewEncapsulation.None,
           })
export class TerraButtonComponent
{
    @Input() inputIsPrimary:boolean;
    @Input() inputIsSecondary:boolean;
    @Input() inputIsSmall:boolean;
    @Input() inputIsLarge:boolean;
    @Input() inputIsDisabled:boolean;
    @Input() inputCaption:string;
    @Input() inputIcon:string;
    @Input() inputType:string;
    @Input() inputIsAlignRight:boolean;
    @Input() inputIsHidden:boolean;
    @Input() inputTooltipText:string;
    @Input() inputTooltipPlacement:string; //top, bottom, left, right
    @Output() outputClicked = new EventEmitter<any>();
    
    constructor()
    {
        this.inputTooltipPlacement = 'top';
        this.inputType = 'button';
    }
    
    private click():void
    {
        this.outputClicked.emit(null);
    }
}
