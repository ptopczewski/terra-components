import {
    Component,
    OnInit,
    Input,
    Output,
    ElementRef,
    EventEmitter,
    ViewEncapsulation,
    OnChanges,
    SimpleChanges
} from '@angular/core';
import { TerraSelectBoxValueInterface } from './data/terra-select-box.interface';

@Component({
               selector:      'terra-select-box',
               styles:        [require('./terra-select-box.component.scss').toString()],
               template:      require('./terra-select-box.component.html'),
               encapsulation: ViewEncapsulation.None,
               host:          {
                   '(document:click)': 'clickedOutside($event)',
               }
           })

export class TerraSelectBoxComponent implements OnInit, OnChanges
{
    @Input() inputName:string;
    @Input() inputIsRequired:boolean;
    @Input() inputDisabled:boolean;
    @Input() inputTooltipText:string;
    @Input() inputTooltipPlacement:string;
    @Input() inputListBoxValues:Array<TerraSelectBoxValueInterface>;
    @Input() inputDefaultSelection:number | string;
    @Output() outputValueChanged = new EventEmitter<TerraSelectBoxValueInterface>();
    @Output() inputSelectedValueChange = new EventEmitter<any>();
    
    @Input()
    set inputSelectedValue(value:number | string)
    {
        if(value)
        {
            this.inputListBoxValues.forEach((item:TerraSelectBoxValueInterface)=>
                                            {
                                                if(item.value == value)
                                                {
                                                    this.select(item);
                                                }
                                            });
        }
    }
    
    get inputSelectedValue():number | string
    {
        return this._selectedValue.value;
    }
    
    private _selectedValue:TerraSelectBoxValueInterface;
    private _toggleOpen:boolean;
    private _hasLabel:boolean;
    private _isValid:boolean;
    private _regex:string;
    private _isInit:boolean;
    
    /**
     *
     * @param elementRef
     */
    constructor(private elementRef:ElementRef)
    {
        this._isInit = false;
        this.isValid = true;
        this.inputTooltipPlacement = 'top';
        this._selectedValue =
        {
            value:   '',
            caption: ''
        };
    }
    
    ngOnInit()
    {
        if(this.inputDefaultSelection)
        {
            this.inputListBoxValues
                .forEach((value:TerraSelectBoxValueInterface) =>
                         {
                             if(value.value == this.inputDefaultSelection)
                             {
                                 value.active = true;
                                 this._selectedValue = value
                             }
                         });
        }
        else
        {
            if(this.inputListBoxValues != null && this.inputListBoxValues.length > 0)
            {
                this.inputListBoxValues[0].active = true;
                this._selectedValue = this.inputListBoxValues[0];
            }
        }
        
        this._toggleOpen = false;
        this._hasLabel = this.inputName != null;
        this._isInit = true;
    }
    
    /**
     *
     * @param changes
     */
    ngOnChanges(changes:SimpleChanges)
    {
        for(let key of Object.keys(changes))
        {
            if(key == "inputListBoxValues" && this._isInit == true)
            {
                if(changes[key].currentValue.length > 0)
                {
                    this.inputListBoxValues.forEach((item:TerraSelectBoxValueInterface)=>
                                                    {
                                                        if(item.value == changes[key].currentValue[0].value)
                                                        {
                                                            this._selectedValue = item;
                            
                                                            this.inputSelectedValueChange.emit(item);
                                                        }
                                                    });
                    
                    //this.select(this.searchListBoxValue(changes[key].currentValue[0].value));
                    
                    //changes[key].currentValue.forEach((item:TerraSelectBoxValueInterface) =>
                    //                                  {
                    //                                      if(item.active && item.active == true)
                    //                                      {
                    //                                          this.select(item);
                    //                                          return;
                    //                                      }
                    //                                  });
                }
                
                
            }
        }
    }
    
    /**
     *
     * @param event
     */
    private clickedOutside(event):void
    {
        if(!this.elementRef.nativeElement.contains(event.target))
        {
            this._toggleOpen = false;
        }
    }
    
    /**
     *
     * @param value
     */
    private select(value:TerraSelectBoxValueInterface):void
    {
        if(value)
        {
            for(let i = 0; i < this.inputListBoxValues.length; i++)
            {
                if(this.inputListBoxValues[i].value == value.value)
                {
                    this._selectedValue.active = false;
                    value.active = true;
                    this._selectedValue = this.inputListBoxValues[i];
                    this.outputValueChanged.emit(this.inputListBoxValues[i]);
                    this.inputSelectedValueChange.emit(this.inputListBoxValues[i].value);
                    
                    return;
                }
            }
        }
    }
    
    private searchListBoxValue(value:any):TerraSelectBoxValueInterface
    {
        let result:any = null;
        
        this.inputListBoxValues.forEach((item:TerraSelectBoxValueInterface)=>
                                        {
                                            if(item.value == value)
                                            {
                                                result = item;
                                            }
                                        });
        return result;
    }
    
    /**
     *
     * @returns {boolean}
     */
    public get isDisabled():boolean
    {
        return this.inputDisabled;
    }
    
    /**
     *
     * @param value
     */
    public set isDisabled(value:boolean)
    {
        this.inputDisabled = value;
    }
    
    /**
     *
     * @returns {boolean}
     */
    public get isValid():boolean
    {
        return this._isValid;
    }
    
    /**
     *
     * @param isValid
     */
    public set isValid(isValid:boolean)
    {
        this._isValid = isValid;
    }
    
    /**
     *
     * @returns {string}
     */
    public get regex():string
    {
        return this._regex;
    }
    
    /**
     *
     * @param regex
     */
    public set regex(regex:string)
    {
        this._regex = regex;
    }
    
}
