// #IMPORTS

import AppSuccess from './success'
import AppError from './error'

// #APP CLASS

export default class App
{
    keyWords = ['log', 'clear', 'success', 'error', 'effect']

    constructor(cmd) { this.cmd = cmd }

    add(name, command)
    {
        if (this.keyWords.includes(name)) return

        this.keyWords.push(name)

        this[name] = command
    }

    testRange(n, min, max)
    {
        if (!/^\d*$/.test(n)) this.error('la valeur doit être un nombre', 'TypeError')
        if (n < min || n > max) this.error(`la valeur doit être comprise entre [${min} et ${max}]`, 'RangeError')
    }

    log(msg)
    {
        const type = msg instanceof Error ? msg instanceof AppSuccess ? 'success' : 'error' : null

        this.cmd.lastChild.insertAdjacentHTML('beforebegin', `
            <div class="line">
                <div class="line-indicator"></div>
                <div class="line-content">
                    ${type ? `
                    <span class="console-${type}">${msg.name}:</span>
                    <span class="console-result">${msg.message}</span>` : `
                    <span class="console-result">${msg}</span>`}
                </div>
            </div>
        `)
    }

    clear()
    {
        const children = [...this.cmd.children]

        for (let i = children.length - 2; i >= 0; i--) this.cmd.removeChild(children[i])
    }

    success(msg) { this.log(new AppSuccess(msg)) }
    
    error(msg, type) { throw new AppError(type ?? 'Error', msg) }

    effect(n, n2)
    {
        this.testRange(n, 0, 1)

        document.querySelector(':root').style.setProperty('--effect', n)
        this.success('effet = ' + n)

        localStorage.setItem('effect', n)
    }
}