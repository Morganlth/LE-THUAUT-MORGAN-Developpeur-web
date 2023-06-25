<!-- #SCRIPT -->

<script>
    // #IMPORT

        // --CONTEXT
        import { app } from '../field/Main.svelte'

    // #VARIABLE

        // --ELEMENT-POPUP
        let
        popup,
        opacity = 1,
        blur = 20

    // #FUNCTIONS

        // --CLEAR
        function clear()
        {
            opacity = 0
            blur = 0

            setTimeout(() => popup.remove(), 1000)
        }

        // --MODE
        function economics()
        {
            app.eco(true)
            
            clear()
        }

        function normal()
        {
            app.eco(false)

            clear()
        }
</script>

<!-- #HTML -->

<div
class="eco-popup"
style:--blur="blur({blur}px)"
style:opacity={opacity}
bind:this={popup}
>
    <section>
        <h5>
            RESSOURCES LIMITÉES :/
        </h5>

        <figure
        class="content"
        >
            <p>Votre machine ne permet pas une expérience optimale.</p>
        <br>
            <p>
                Je vous conseille de passer en mode <strong>économique</strong>.
                <br>
                Certains paramètres seront désactivées pour amméliorer les performances de la page.
                <br>
                Si vous passer en mode <strong>économique</strong>, ce message d'alerte ne s'affichera plus lors de vos prochains passages.
            </p>
        <br>
            <p>
                Vous pouvez retrouver les paramètres modifier dans la Console.
                <br>
                La commande
    
                <strong
                class="command"
                >
                    <span>app</span>
                    <span>clear</span>
                </strong>

                est automatiquement écrite pour vous permettre de nettoyer rapidement la Console.
                <br>
                Pour éxécuter la commande
                
                <strong
                class="command"
                >
                    <span>app</span>
                    <span>clear</span>
                </strong>
    
                faites un click droit sur la texte et appuyez sur la touche Entrée.
            </p>
        <br>
            <p>
                Si vous souhaitez redéfinir les paramètres par défaut, vous pouvez passer par la commandes
                
                <strong
                class="command"
                >
                    <span>app</span>
                    <span>reset</span></strong>.
                <br>
                Vous retrouvez la liste des commandes dans la section <strong>commande</strong> de la Console.
            </p>
        <br>
            <figcaption>- LE THUAUT MORGAN -</figcaption>
        </figure>

        <div
        class="choice"
        >
            <button
            type="button"
            title="conseillé"
            on:click={economics}
            >
                PASSER EN MODE ÉCO
            </button>

            <button
            type="button"
            title="déconseillé"
            on:click={normal}
            >
                GARDER LES OPTIONS ACTUELLES
            </button>
        </div>
    </section>
</div>

<!-- #STYLE -->

<style
lang="scss"
>
    /* #IMPORTS */

    @import
    '../../assets/scss/styles/flex.scss',
    '../../assets/scss/styles/position.scss',
    '../../assets/scss/styles/size.scss',
    '../../assets/scss/styles/background.scss',
    '../../assets/scss/styles/font.scss',
    '../../assets/scss/styles/cursor.scss';

    /* #GROUPS */

    .eco-popup
    {
        @include flex;
        @include f-column;
        @include f-center;
        @include xy-start;
        @include any;
        @include black-glass(var(--blur));

        position: fixed;

        transition: backdrop-filter 1s, opacity 1s;

        section
        {
            width: 70%;

            padding: 50px 60px;

            box-sizing: border-box;
        }

        h5
        {
            @include title($light, 48px, 48px);
        }

        .content
        {
            margin: 50px 0 40px 5%;
            padding: 0 50px;
    
            border-left: solid $secondary 2px;

            box-sizing: border-box;
        }

        p,
        figcaption
        {
            @include font-command;

            font-size: 18px;
            font-weight: 100;
            line-height: 22px;
        }
        p
        {
            @include font-command;

            color: $light;
        }
        figcaption
        {
            color: $s-light;
            text-align: right;
        }
        strong { font-weight: 600; }
        .command
        {
            padding: 1px 10px 4px;
    
            background-color: $dark;
    
            span:nth-child(1) { color: $primary; }
            span:nth-child(2) { color: $secondary; }
        }

        button
        {
            @include text-info;
            @include pointer;
    
            padding: 8px 15px;
    
            background-color: transparent;

            box-sizing: border-box;
        }
        button:nth-child(1)
        {
            margin-right: 10px;

            border: solid $primary 1px;

            &:hover { color: $primary; }
        }
        button:nth-child(2)
        {
            border: solid $secondary 1px;
    
            &:hover { color: $secondary; }
        }
    }
</style>