// #APP-MANAGER

export default class App
{
    // --VARIABLES
    keyWords = ['log', 'clear', 'reset', 'success', 'error', 'getFps', 'effect']
    storageKeys = ['effect']

    cmd = null

    // --TEST
    testDefault(value) { return value === 'd' || value === 'default' }

    testNumber(value, min, max)
    {
        if (!/^\d*?\.?\d+$/.test(value)) this.error('la valeur doit être un nombre', 'TypeError')
        if (value < min || value > max) this.error(`la valeur doit être comprise entre [${min} et ${max}]`, 'RangeError')

        return parseInt(value, 10)
    }

    testBoolean(value)
    {
        if (value === 'f' || value === 'false') return false
        else if (value === 't' || value === 'true') return true
        else this.error('"t" | "true" pour vrai - "f" | "false" pour faux', 'TypeError')
    }

    // --CYCLE
    clear()
    {
        const children = [...this.cmd.children]

        for (let i = children.length - 2; i >= 0; i--) this.cmd.removeChild(children[i])
    }

    reset(view)
    {
        for (const key of this.storageKeys) this[key]('d')

        if (!view) this.clear()
    }

    // --MANAGEMENT
    log(msg)
    {
        const type = msg instanceof Error ? msg instanceof AppSuccess ? 'success' : 'error' : null

        this.cmd.lastChild.insertAdjacentHTML('beforebegin', `
            <div class="line">
                <div class="line-indicator"></div>
                <div class="line-content">
                    ${type ? `
                    <span class="console-${type}">${msg.name}:</span>
                    <pre class="console-result">${msg.message.trim()}</pre>` : `
                    <pre class="console-result">${msg.trim()}</pre>`}
                </div>
            </div>
        `)
    }

    success(msg) { this.log(new AppSuccess(msg)) }
    
    error(msg, type) { throw new AppError(type ?? 'Error', msg) }

    // --SET
    effect(n)
    {
        this.testDefault(n) ? n = .3 : this.testNumber(n, 0, 1)

        document.querySelector(':root').style.setProperty('--effect', n)
        localStorage.setItem('effect', n)
    
        this.success('effet ' + n)
    }

    // --GET
    async getFps() { this.log('' + await getFps()) }

    // --CODE
    add(name, command, storage)
    {
        if (!this.keyWords.includes(name)) this.keyWords.push(name)
        if (storage && !this.storageKeys.includes(name)) this.storageKeys.push(name)

        this[name] = command
    }
}

// #IMPORTS

import AppSuccess from './success'
import AppError from './error'

import getFps from './fps'