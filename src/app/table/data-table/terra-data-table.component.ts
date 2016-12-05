import {
    Component,
    Input,
    Output,
    ViewChild,
    EventEmitter
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { TerraDataTableHeaderCellInterface } from './cell/terra-data-table-header-cell.interface';
import { TerraDataTableRowInterface } from './row/terra-data-table-row.interface';
import { TerraBaseService } from '../../service/terra-base.service';
import { TerraPagerInterface } from '../../pager/data/terra-pager.interface';
import { TerraBaseData } from '../../data/terra-base.data';
import { TerraCheckboxComponent } from '../../forms/checkbox/terra-checkbox.component';
import { TerraSelectBoxValueInterface } from '../../forms/select-box/data/terra-select-box.interface';
import { TerraAlertComponent } from '../../alert/terra-alert.component';
import { TerraOverlayComponent } from '../../overlay/terra-overlay.component';
import { TerraDataTableContextMenuService } from './context-menu/service/terra-data-table-context-menu.service';

@Component({
               selector:  'terra-data-table',
               providers: [TerraDataTableContextMenuService],
               styles:    [require('./terra-data-table.component.scss').toString()],
               template:  require('./terra-data-table.component.html')
           })

export class TerraDataTableComponent<S extends TerraBaseService, D extends TerraBaseData>
{
    @ViewChild('viewChildHeaderCheckbox') viewChildHeaderCheckbox:TerraCheckboxComponent;
    @Input() inputService:S;
    @Output() outputDoPagingEvent = new EventEmitter<TerraPagerInterface>();
    private _headerList:Array<TerraDataTableHeaderCellInterface>;
    private _rowList:Array<TerraDataTableRowInterface<D>>;
    private _selectedRowList:Array<TerraDataTableRowInterface<D>> = [];
    private _isHeaderCheckboxChecked:boolean = false;
    private _pagingData:TerraPagerInterface;
    private _pagingSize:Array<TerraSelectBoxValueInterface>;
    private _onSuccessFunction:(res)=>void;
    private _defaultPagingSize:number;
    private _alert:TerraAlertComponent = TerraAlertComponent.getInstance();
    @Input()
    private _hasCheckboxes:boolean = true;
    
    // Overlay
    //@ViewChild('viewChildOverlayDataTableSettings') viewChildOverlayDataTableSettings:TerraOverlayComponent;
    //private _overlayRowList:Array<TerraDataTableRowInterface<D>>;
    //private _selectedOverlayRowList:Array<TerraDataTableRowInterface<D>> = [];
    //private _saveButtonTooltip:string = 'Speichern';
    //private _cancelButtonTooltip:string = 'Abbrechen';
    
    constructor()
    {
    }
    
    private onHeaderCheckboxChange(isChecked:boolean):void
    {
        this._isHeaderCheckboxChecked = isChecked;
        
        this.rowList.forEach(
            (row)=>
            {
                this.changeRowState(isChecked, row);
            });
    }
    
    private onRowCheckboxChange(isChecked:boolean,
                                row:TerraDataTableRowInterface<D>):void
    {
        this.changeRowState(isChecked, row);
        
        if(this.selectedRowList.length == 0)
        {
            this._isHeaderCheckboxChecked = false;
        }
        else if(this.selectedRowList.length > 0 && this.rowList.length == this.selectedRowList.length)
        {
            this._isHeaderCheckboxChecked = true;
        }
        else
        {
            this.viewChildHeaderCheckbox.isIndeterminate = true;
        }
    }
    
    private changeRowState(isChecked:boolean,
                           rowToChange:TerraDataTableRowInterface<D>):void
    {
        rowToChange.selected = isChecked;
        
        let rowFound:boolean = false;
        
        this.selectedRowList.forEach(
            (row)=>
            {
                if(row == rowToChange)
                {
                    rowFound = true;
                }
            });
        
        if(rowToChange.selected)
        {
            if(!rowFound)
            {
                this.selectedRowList.push(rowToChange);
            }
        }
        else
        {
            let index = this.selectedRowList.indexOf(rowToChange);
            
            this.selectedRowList.splice(index, 1);
        }
    }
    
    public get headerList():Array<TerraDataTableHeaderCellInterface>
    {
        return this._headerList;
    }
    
    public set headerList(value:Array<TerraDataTableHeaderCellInterface>)
    {
        this._headerList = value;
    }
    
    public get rowList():Array<TerraDataTableRowInterface<D>>
    {
        return this._rowList;
    }
    
    public set rowList(value:Array<TerraDataTableRowInterface<D>>)
    {
        this._rowList = value;
        
        this.rowList.forEach(
            row =>row.contextMenuLinkList.forEach(
                l => l.subject.subscribe(
                    val=> val.clickFunction(val)))
        );
    }
    
    public deleteRow(rowToDelete:TerraDataTableRowInterface<D>):void
    {
        let index = this.rowList.indexOf(rowToDelete);
        
        this.rowList.splice(index, 1);
        
        let selectedIndex = this.selectedRowList.indexOf(rowToDelete);
        
        // check if row exists in selectedRowList
        if(selectedIndex != null)
        {
            this.selectedRowList.splice(selectedIndex, 1);
        }
    }
    
    public get selectedRowList():Array<TerraDataTableRowInterface<D>>
    {
        return this._selectedRowList;
    }
    
    public set pagingData(value:TerraPagerInterface)
    {
        this._pagingData = value;
    }
    
    public get pagingData():TerraPagerInterface
    {
        return this._pagingData;
    }
    
    public doPaging(pagerData:TerraPagerInterface):void
    {
        this.outputDoPagingEvent.emit(pagerData);
        
        this._isHeaderCheckboxChecked = false;
        this.rowList.forEach(
            (row)=>
            {
                this.changeRowState(false, row);
            });
    }
    
    public get pagingSize():Array<TerraSelectBoxValueInterface>
    {
        return this._pagingSize;
    }
    
    public set pagingSize(value:Array<TerraSelectBoxValueInterface>)
    {
        this._pagingSize = value;
    }
    
    public get defaultPagingSize():number
    {
        return this._defaultPagingSize;
    }
    
    public set defaultPagingSize(value:number)
    {
        this._defaultPagingSize = value;
    }
    
    public get onSuccessFunction():(res:any)=>void
    {
        return this._onSuccessFunction;
    }
    
    public set onSuccessFunction(value:(res:any)=>void)
    {
        this._onSuccessFunction = value;
    }
    
    public doSearch(restCall:Observable<D>):void
    {
        //TODO check
        restCall.subscribe(
            this.onSuccessFunction,
            error =>
            {
                if(error.status == 401 ||
                   error.status == 500)
                {
                    //TODO
                    alert(error.status);
                }
            }
        )
    }
    
    // ------------------------------------------------------
    // viewChildOverlay and column hiding functionality
    
    //private openOverlayDataTableSettings():void
    //{
    //    this.viewChildOverlayDataTableSettings.showOverlay();
    //}
    
    //private primaryClicked(viewChildOverlay:TerraOverlayComponent):void
    //{
    //    this.overlayRowList.forEach(
    //        (row) => row.cellList.forEach(
    //            (cell) =>
    //            {
    //                this.changeColumnVisibility(cell.identifier, row.selected);
    //            }
    //        )
    //    )
    //
    //    viewChildOverlay.hideOverlay();
    //}
    //
    //private secondaryClicked(viewChildOverlay:TerraOverlayComponent):void
    //{
    //    viewChildOverlay.hideOverlay();
    //}
    //
    //private onOverlayCheckboxChange(isChecked:boolean,
    //                                row:TerraDataTableRowInterface<D>):void
    //{
    //    this.changeOverlayCheckboxState(isChecked, row);
    //}
    
    //public changeOverlayCheckboxState(isChecked:boolean,
    //                                  rowToChange:TerraDataTableRowInterface<D>):void
    //{
    //    rowToChange.selected = isChecked;
    //
    //    let rowFound:boolean = false;
    //
    //    this._selectedOverlayRowList.forEach(
    //        (row)=>
    //        {
    //            if(row == rowToChange)
    //            {
    //                rowFound = true;
    //            }
    //        });
    //
    //    if(rowToChange.selected)
    //    {
    //        if(!rowFound)
    //        {
    //            this._selectedOverlayRowList.push(rowToChange);
    //        }
    //    }
    //    else
    //    {
    //        let index = this._selectedOverlayRowList.indexOf(rowToChange);
    //
    //        this._selectedOverlayRowList.splice(index, 1);
    //    }
    //}
    
    //public get overlayRowList():Array<TerraDataTableRowInterface<D>>
    //{
    //    return this._overlayRowList;
    //}
    
    //public set overlayRowList(value:Array<TerraDataTableRowInterface<D>>)
    //{
    //    this._overlayRowList = value;
    //}
    
    //private changeColumnVisibility(id:string,
    //                               isChecked:boolean):void
    //{
    //    let hide:boolean;
    //
    //    if(isChecked)
    //    {
    //        hide = false;
    //    }
    //    else
    //    {
    //        hide = true;
    //    }
    //    this._headerList.forEach(
    //        (cell)=>
    //        {
    //            if(cell.identifier == id)
    //            {
    //                cell.isHidden = hide;
    //            }
    //        }
    //    )
    //
    //    this.rowList.forEach(
    //        (row)=>
    //        {
    //            this.changeCellVisibility(row, id, hide);
    //        });
    //}
    //
    //private changeCellVisibility(rowToChange:TerraDataTableRowInterface<D>,
    //                             id:string,
    //                             hide:boolean):void
    //{
    //    rowToChange.cellList.forEach(
    //        (i) =>
    //        {
    //            if(i.identifier == id)
    //            {
    //                i.isHidden = hide;
    //            }
    //        });
    //}
    //
    //public showAllColumns():void
    //{
    //    this._headerList.forEach(
    //        (cell)=>
    //        {
    //            if(cell.isHidden == true)
    //            {
    //                cell.isHidden = false;
    //            }
    //        });
    //
    //    this.rowList.forEach(
    //        (row)=>
    //        {
    //            row.cellList.forEach(
    //                (i) =>
    //                {
    //                    if(i.isHidden == true)
    //                    {
    //                        i.isHidden = false;
    //                    }
    //                })
    //        });
    //
    //    this.overlayRowList.forEach(
    //        (row) =>
    //        {
    //            row.selected = true;
    //        }
    //    )
    //}
}
