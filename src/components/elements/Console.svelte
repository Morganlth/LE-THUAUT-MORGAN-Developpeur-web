<!-- #SCRIPT -->

<script>
    // #IMPORTS

        // #JS
        import Success from '../../assets/js/success'

        // #SCSS
        import '../../assets/scss/components/console.scss'

        // #SVELTE
        import { onMount } from "svelte"

    // #CONSTANTE

    const keyWords = ['blockSize', 'clear', 'darkSpace', 'effect', 'log', 'setNumber']

    // #VARIABLES

    let
    cmd,
    input,
    mirror,
    child_0,
    child_1,
    params = null

    // #FUNCTIONS

    function set()
    {
        app.log = (msg) =>
        {
            const type = msg instanceof Success ? 'success' : msg instanceof Error ? 'error' : 'result'

            cmd.lastChild.insertAdjacentHTML('beforebegin',
            `
                <div class="line">
                    <div class="line-indicator"></div>
                    <div class="line-content"><div class="console-${type}">${msg}</div></div>
                </div>
            `)
        }

        app.clear = () =>
        {
            const children = [...cmd.children]

            for (let i = children.length - 2; i >= 0; i--) cmd.removeChild(children[i])
        }

        app.effect = (opacity) =>
        {
            if (isNaN(parseInt(opacity, 10))) app.log(new TypeError('la valeur doit être un nombre'))
            else if (opacity < 0 || opacity > 1) app.log(new RangeError('nombre compris entre 0 et 1 inclus'))
            else
            {
                document.querySelector(':root').style.setProperty('--effect-opacity', opacity)
                app.log(new Success('effet = ' + opacity))
            }
        }
    }

    function writingEvent()
    {
        const
        value = input.value,
        length = value.length

        ;(length === 3 || value[3] === '.') && value.substring(0, 3) === 'app' ? analyse(value, length) : update(value, '', 'remove')
    }

    function analyse(value, length)
    {
        let text = ''

        if (length > 3) text = check(value.substring(3))

        update('app', text, 'add')

        if (params !== null)
        {
            child_1.insertAdjacentHTML('beforeend', `<span>${params}</span>`)
            child_1.insertAdjacentText('beforeend', ')')
        }
    }

    function update(value_0, value_1, action)
    {
        child_0.classList[action]('app-context')
        child_0.innerText = value_0
        child_1.innerText = value_1
    }

    function check(value)
    {
        if (value[value.length - 1] === ')')
        {
            const
            index = value.indexOf('('),
            absoluteValue = index > 0 ? value.substring(1, index) : value.replace('.', '')

            if (keyWords.includes(absoluteValue))
            {
                child_1.classList.add('func-context')
                params = value.substring(index + 1, value.length - 1)

                return '.' + absoluteValue + '('
            }
        }

        child_1.classList.remove('func-context')
        params = null

        return value
    }

    function enterEvent(e)
    {
        if (e.key === 'Enter')
        {
            if (params !== null && child_0.innerText === 'app') execute()
        }
    }

    function execute()
    {
        const
        value = child_1.innerText.replace('.', ''),
        index = value.indexOf('(')

        app[value.substring(0, index)](params)
    
        reset()
    }

    function reset()
    {
        update('', '', 'remove')
        input.value = ''
        cmd.scrollTop = cmd.scrollHeight - cmd.offsetHeight
        params = null
    }

    // #CYCLE

    onMount(set)
</script>

<!-- #HTML -->

<section
class="console"
>
    <div>
        <h3>_Console</h3>

        <p>RECHERCHER ET MODIFIER</p>
    </div>

    <div
    class="cmd"
    bind:this={cmd}
    >
        <div
        class="line"
        >
            <div
            class="line-indicator"
            >
                >
            </div>

            <div
            class="line-content"
            >
                <input
                type="text"
                maxlength="59"
                spellcheck="false"
                bind:this={input}
                on:input={writingEvent}
                on:keydown={enterEvent}
                />

                <div
                class="mirror"
                bind:this={mirror}
                >
                    <span
                    bind:this={child_0}
                    ></span>
                    <span
                    bind:this={child_1}
                    ></span>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- #STYLE -->

<style
lang="scss"
>
    /* #IMPORTS */

    @import
    '../../assets/scss/styles/flex.scss',
    '../../assets/scss/styles/background.scss',
    '../../assets/scss/styles/font.scss';

    /* #GROUPS */

    .console
    {
        @include black-glass(hue-rotate(180deg));

        width: 50%;
        height: 50%;

        padding: 30px 40px 20px;

        border: solid $dark 4px;

        &,
        .cmd
        { box-sizing: border-box }

        &
        >div:nth-child(1)
        {
            @include flex;

            justify-content: space-between;
            align-items: flex-end;

            height: 40px;
    
            margin-bottom: 20px;
        }

        h3 { @include title-3; }

        p { @include text-info; }

        .cmd
        {
            overflow-x: hidden;
            overflow-y: auto;

            height: calc(100% - 60px); /* div:nth-child(1) height + margin */

            padding-bottom: 10px;

            border-right: solid $secondary 2px;
            border-bottom: solid $secondary 2px;

            &::-webkit-scrollbar
            {
                width: 15px;

                background-color: $dark;
            }
            &::-webkit-scrollbar-thumb
            {
                background-color: $s-light;

                border-left: solid $dark 10px;
            }
        }
    }
</style>