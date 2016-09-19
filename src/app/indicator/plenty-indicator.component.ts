import {
    Component,
    OnInit,
    Input
} from '@angular/core';

@Component({
               selector: 'plenty-indicator',
               templateUrl: './plenty-indicator.component.html',
               styleUrls: ['./plenty-indicator.component.css']
           })
export class PlentyIndicator implements OnInit
{
    @Input() label: string;
    @Input() type: string;

    constructor()
    {
    }

    ngOnInit()
    {
    }

}