import {
    Component,
    OnInit,
    Input,
    Output,
    ViewChild,
    EventEmitter
} from '@angular/core';

@Component({
               selector: 'terra-filter',
               styles:   [require('./terra-filter.component.scss').toString()],
               template: require('./terra-filter.component.html')
           })
export class TerraFilterComponent implements OnInit
{
    
    @ViewChild('viewChildInputList') viewChildInputList;
    @Input() inputSearchLabel:string;
    @Input() inputResetLabel:string;
    @Input() inputInputList:any[];
    @Output() outputOnSearchBtnClicked = new EventEmitter<any>();
    @Output() outputOnResetBtnClicked = new EventEmitter<any>();
    
    constructor()
    {
    }
    
    ngOnInit()
    {
    }
    
    private searchBtnClicked():void
    {
        this.outputOnSearchBtnClicked.emit(null);
    }
    
    private resetBtnClicked():void
    {
        this.outputOnResetBtnClicked.emit(null);
    }
}
