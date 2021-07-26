import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

import { AppComponent } from './app.component'
import { CardModule } from 'primeng/card'
import { ButtonModule } from 'primeng/button'
import { InputTextareaModule } from 'primeng/inputtextarea'
import { ToastModule } from 'primeng/toast'

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        CardModule,
        ButtonModule,
        InputTextareaModule,
        ToastModule
    ],
    providers: [ToastModule],
    bootstrap: [AppComponent]
})
export class AppModule {}
