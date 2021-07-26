import { Component, OnInit } from '@angular/core'

import { PrimeNGConfig } from 'primeng/api'
import { MessageService } from 'primeng/api'

import { environment } from './../environments/environment'

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    providers: [MessageService]
})
export class AppComponent implements OnInit {
    constructor(
        private primengConfig: PrimeNGConfig,
        private messageService: MessageService
    ) {}

    txtResultCopy: string = ''
    items: any[] = []
    result: string = ''
    resultJson: string = ''
    disableResult: Boolean = false
    template: string =
        'Key: #key\r\nDescription: #desc\r\nSub type: #sub\r\nError code: #error\r\nTime: #time'

    ngOnInit(): void {
        this.primengConfig.ripple = true

        this.items = [
            {
                name: 'CIDMS API',
                url: environment.CIDMS
            },
            {
                name: 'PIDMS API',
                url: environment.PIDMS
            },
            {
                name: 'REDEEM API',
                url: environment.REDEEM
            }
        ]
    }

    public async makeMultRequestApi(event: Event, url: string): Promise<void> {
        event.preventDefault()
        this.result = 'Carregando...'
        this.txtResultCopy = ''
        this.resultJson = ''
        this.disableResult = true
        const newLine = '\r\n -------------------------------- \r\n'
        try {
            const txtID = document.getElementById('txtID') as HTMLInputElement
            let newResult = ''
            if (txtID) {
                const ids = txtID.value.split(';')
                for (let id of ids) {
                    const newUrl = url.replace('#here', id)
                    const json = await this.makeSingleRequestApi(newUrl)
                    if (Array.isArray(json)) {
                        let arr = ''
                        json.map((item) => {
                            arr += this.replaceTemplate(item) + newLine
                        })
                        newResult += arr
                    } else {
                        newResult += this.replaceTemplate(json) + newLine
                    }
                }
            }
            this.result = newResult
        } catch (error) {
            this.result = ''
            this.resultJson = ''
            this.txtResultCopy = ''
            console.log(error)
        } finally {
            this.disableResult = false
        }
    }

    private async makeSingleRequestApi(url: string): Promise<any> {
        try {
            await this.sleep(2000)
            const resultApi = await fetch(url)
            return await resultApi.json()
        } catch (error) {
            return ''
        }
    }

    private replaceTemplate(json: any): string {
        if (!json) {
            return ''
        }
        this.txtResultCopy += (json.confirmation_id_no_dash || '') + ''
        this.resultJson += JSON.stringify(json)
        return this.template
            .replace('#key', json.keyname || '')
            .replace('#desc', json.prd || '')
            .replace('#sub', json.sub || '')
            .replace('#error', json.errorcode || '')
            .replace('#time', json.datetime_checked_done || '')
    }

    private async sleep(msec: number) {
        return new Promise((resolve) => setTimeout(resolve, msec))
    }

    copyResult(event: Event) {
        event.preventDefault()

        const txtCopy = document.createElement('textarea')
        document.body.appendChild(txtCopy)
        txtCopy.value = this.txtResultCopy
        txtCopy.select()
        document.execCommand('copy')
        document.body.removeChild(txtCopy)

        this.messageService.add({
            key: 'bc',
            severity: 'success',
            summary: 'Copiado com sucesso!'
        })
    }
}
