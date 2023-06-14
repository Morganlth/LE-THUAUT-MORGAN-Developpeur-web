<!-- #SCRIPT -->

<script context="module">
    // #EXPORT

        // #MODULE
        export let app
</script>

<script>
    // #IMPORTS

        // #SCSS
        import '../../assets/scss/components/console.scss'

        // #JS
        import App from '../../assets/js/app'
        import AppError from '../../assets/js/error'

        // #SVELTE
        import { onMount } from 'svelte'

    // #CONSTANTE
    
    const children = []

    // #VARIABLES

    let
    cmd,
    input,
    mirror,
    last = 'app'

    // #FUNCTIONS

    function set() { app = new App(cmd) }

    function writingEvent()
    {
        const value = input.value

        ;(value.length === 3 || value[3] === ' ') && value.substring(0, 3) === 'app' ? analyse(value) : update('remove', [value])
    }

    function analyse(value)
    {
        const values = value.match(/^(app)(?:\s(\S*))?(?:\s(.*))?$/)

        values.shift()

        if (values[1]) check(values[1])

        update('add', values)
    }

    function update(action, values = [])
    {
        children[0].classList[action]('app-context')

        for (let i = 0; i < children.length; i++) children[i].innerText = values[i] ?? ''
    }

    function check(value)
    {
        children[1].classList[app.keyWords.includes(value) ? 'add' : 'remove']('func-context')
    }

    function keyEvent(e)
    {
        const key = e.key

        switch (key)
        {
            case 'Enter':
                if (children[0].innerText === 'app') execute()
                break
            case 'ArrowUp':
                const length = last.length

                input.value = last
                input.focus()
                input.setSelectionRange(length, length)
                writingEvent()

                break
            default: break
        }
    }

    function execute()
    {
        const
        func = children[1].innerText,
        param = children[2].innerText.trim()
    
        last = input.value

        try
        {
            app[func](param)

            reset()
        }
        catch (e)
        {
            const err = e instanceof AppError ? e : new AppError('TypeError', `"${func}" n'est pas une fonction valide`)
            
            app.log(err)
        }
    }

    function reset()
    {
        update('remove')
        input.value = ''
        cmd.scrollTop = cmd.scrollHeight - cmd.offsetHeight
    }

    // #CYCLE

    onMount(set)
</script>

<!-- #HTML -->

<section
class="console"
>
    <div>
        <h3>Console</h3>

        <p>RECHERCHER & MODIFIER</p>
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
                on:keyup={keyEvent}
                />

                <div
                class="mirror"
                bind:this={mirror}
                >
                    {#each [0, 1, 2] as child}
                        <pre
                        bind:this={children[child]}
                        >
                        </pre> &nbsp;
                    {/each}
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

            pre
            {
                display: inline;

                font-family: inherit;
            }

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