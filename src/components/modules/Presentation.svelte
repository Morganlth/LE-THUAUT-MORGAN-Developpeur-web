<!-- #SCRIPT -->

<script>
    // #EXPORTS

        // #PROPS
        export let
        _lock,
        _width,
        _colors

        // #BINDS
        export let
        scroll,
        mouseMove

    // #IMPORTS

        // #SVELTE
        import { onMount } from 'svelte'

        // #ELEMENTS
        import Snake from '../elements/Snake.svelte'
        import Card from '../elements/Card.svelte'

    // #CONSTANTE

    const cards =
    [
        { title: 'NOM - PRÉNOM', content: ['LE THUAUT Morgan'] },
        { title: 'AGE', content: ['21 ans'] },
        { title: 'PROFESSION', content: ['Développeur Web - FULL STACK'] },
        { title: 'LOCALITÉ', content: ['Morbihan - FRANCE'] },
        { title: 'ÉTUDES - FORMATIONS', content: ['Lycée Jeanne d\'Arc PONTIVY - bac S SVT spécialité MATHS', 'OpenClassrooms - formation de Développeur Web'] },
        { title: 'CONTACT', content: ['Tel:  06 09 23 72 08', 'Email:  lethuaut.morgan@gmail.com'] }
    ]

    // #VARIABLES

    let charged = false

    let
    xy = [],
    textOff,
    snakeOff
    
    let i = 0

    // #REACTIVES

    $: update(xy)
    $: textOff ? hidden() : view()
    $: snakeOff ? view() : hidden()

    // #FUNCTIONS

    function set() { charged = true }

    function update(xy)
    {
        if (xy.length)
        {
            if (i === cards.length) i = 0

            const j = i - 1

            cards[j < 0 ? cards.length - 1 : j].hidden()
            cards[i++].update(xy[0], xy[1])
        }
    }

    function view()
    {
        if (textOff || !snakeOff) return

        let y = 115,
        x = 50

        for (let i = 0; i < cards.length; i++)
        {
            cards[i].update(x, y)

            y += 115
        }
    }

    function hidden()
    {
        if (charged)
            for (let i = 0; i < cards.length; i++) cards[i].hidden()
    }

    // #CYCLE

    onMount(set)
</script>

<!-- #HTML -->

<div
id="presentation"
style:width={_width}
>
    <Snake
    {_colors}
    {_lock}
    bind:xy={xy}
    bind:textOff={textOff}
    bind:snakeOff={snakeOff}
    bind:scroll={scroll}
    bind:mouseMove={mouseMove}
    />

    <div
    class="card-container"
    >
        {#each cards as card}
            <Card
            _title={card.title}
            _content={card.content}
            _dark={_colors.dark}
            bind:update={card.update}
            bind:hidden={card.hidden}
            />
        {/each}
    </div>
</div>

<!-- #STYLE -->

<style
lang="scss"
>
    /* #IMPORTS */

    @import
    '../../assets/scss/styles/flex.scss',
    '../../assets/scss/styles/position.scss',
    '../../assets/scss/styles/size.scss';

    /* #GROUPS */

    #presentation
    {
        @include relative;
    
        height: 100vh;

        background-color: $dark;
    }
</style>