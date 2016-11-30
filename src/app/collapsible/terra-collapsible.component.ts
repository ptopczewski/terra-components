import {
    Component,
    Input,
    Output,
    EventEmitter,
    ViewEncapsulation
} from '@angular/core';
import { CollapseModule } from 'ng2-bootstrap/ng2-bootstrap';

@Component({
               selector:      'terra-collapsible',
               styles:        [require('./terra-collapsible.component.scss').toString()],
               template:      require('./terra-collapsible.component.html'),
               encapsulation: ViewEncapsulation.None,
           })
export class TerraCollapsibleComponent
{
    @Input() inputButtonCaption:string;
    
    private isCollapsed:boolean = false;
    
    constructor()
    {
        
    }
    
    public collapsed(event:any):void
    {
        console.log(event);
    }
    
    public expanded(event:any):void
    {
        console.log(event);
    }
}
