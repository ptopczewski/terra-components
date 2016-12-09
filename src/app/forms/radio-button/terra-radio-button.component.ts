import {
    Component,
    Input,
    Output,
    EventEmitter,
    ViewChild,
    OnInit
} from '@angular/core';

/**
 * @author mfrank
 */
@Component({
               selector:  'terra-radio-button',
               template:  require('./terra-radio-button.component.html'),
               styles:    [require('./terra-radio-button.component.scss').toString()]
           })
export class TerraRadioButtonComponent implements OnInit
{
    @ViewChild('viewChildRadioButton') viewChildRadioButton;
    
    @Input() inputCaption:string;
    @Input() inputName:string;
    @Input() inputIsDisabled:boolean;
    @Input() inputIsUncheckable:boolean;
    @Output() inputValueChange = new EventEmitter<any>();
    
    private _value:any = false;
    
    @Input()
    public get inputValue():any
    {
        return this._value;
    }
    
    public set inputValue(value:any)
    {
        this._value = value;
        setTimeout(() => this.inputValueChange.emit(this.inputValue), 0);
    }
    
    constructor()
    {
        this.inputIsUncheckable = false;
    }
    
    public ngOnInit():void
    {
        if(this.inputIsUncheckable)
        {
            this.viewChildRadioButton.nativeElement.attributes.uncheckable = true;
        }
    }
}
