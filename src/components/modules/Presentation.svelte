<!-- #SCRIPT -->

<script>
    // #EXPORTS

        // #PROPS
        export let
        _grabbing,
        _width,
        _colors

        // #BINDS
        export let
        scroll,
        mouseMove

    // #IMPORTS

        // #ELEMENTS
        import Snake from '../elements/Snake.svelte'
        import Card from '../elements/Card.svelte'

    // #CONSTANTE

    const cards =
    [
        { title: 'NOM - PRÉNOM', content: ['LE THUAUT Morgan'], translateX: 0, translateY: 0 },
        { title: 'AGE', content: ['21 ans'], translateX: 0, translateY: 0 },
        { title: 'PROFESSION', content: ['Développeur Web - FULL STACK'], translateX: 0, translateY: 0 },
        { title: 'LOCALITÉ', content: ['Morbihan - FRANCE'], translateX: 0, translateY: 0 },
        { title: 'ÉTUDES - FORMATIONS', content: ['Lycée Jeanne d\'Arc PONTIVY - bac S SVT spécialité MATHS', 'OpenClassrooms - formation de Développeur Web'], translateX: 0, translateY: 0 },
        { title: 'CONTACT', content: ['Tel:  06 09 23 72 08', 'Email:  lethuaut.morgan@gmail.com'], translateX: 0, translateY: 0 }
    ]

    // #VARIABLES

    let
    xy = [],
    i = 0

    // #REACTIVE

    $: update(xy)

    // #FUNCTIONS

    function update(xy)
    {
        if (xy.length)
        {
            if (i === cards.length) i = 0

            const j = i - 1

            cards[j < 0 ? cards.length - 1 : j].hidden()
    
            cards[i++].animation(xy[0], xy[1])
        }
    }
</script>

<!-- #HTML -->

<div
id="presentation"
style:width={_width}
>
    <Snake
    {_colors}
    {_grabbing}
    bind:xy={xy}
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
            {_colors}
            bind:animation={card.animation}
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