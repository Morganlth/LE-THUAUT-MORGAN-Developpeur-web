<!-- #SCRIPT -->

<script>
    // #IMPORTS

        // --CONTEXTS
        import { app, spring } from '../field/Main.svelte'

    // #VARIABLES

        // --SPRING-CONTEXT
        let spring_ON = spring.spring_ON

        // --ELEMENT-POPUP
        let
        ecopopup_POPUP,
        ecopopup_OPACITY = 1

    // #FUNCTIONS

        // --SET
        function ecopopup_setMode()
        {
            if (!this) spring.spring_ON = spring_ON
    
            app.app_eco(this)
            
            ecopopup_clear()
        }
    
        // --CLEAR
        function ecopopup_clear()
        {
            ecopopup_OPACITY = 0

            setTimeout(() => ecopopup_POPUP.remove(), 1000)
        }

    // #CODE

        // --SPRING-CONTEXT
        spring.spring_ON = false
</script>

<!-- #HTML -->

<div
class="eco-popup"
style:opacity={ecopopup_OPACITY}
bind:this={ecopopup_POPUP}
>
    <section>
        <h3>
            RESSOURCES LIMITÉES
        </h3>

        <figure
        class="content"
        >
            <section>
                <h4>- MODE ÉCONOMIQUE</h4>

                <p>Votre machine ne permet pas une expérience optimale.</p>
    
                <p>
                    Je vous conseille de passer en mode <strong>économique</strong>.
                    <br>
                    Certains paramètres seront désactivés pour améliorer les performances de la page.
                    <br>
                    Si vous passez en mode <strong>économique</strong>, ce message d'alerte ne s'affichera plus lors de vos prochains passages.
                </p>
    
                <h4>- LA CONSOLE</h4>
    
                <p>
                    Si vous souhaitez redéfinir les paramètres par défaut, vous pouvez passer par la commande
                    
                    <strong
                    class="command"
                    >
                        <span>app</span>
                        <span>reset</span>
                    </strong>
                    
                    dans la <strong>Console</strong> (selon les tailles d'écrans la <strong>Console</strong> n'est pas toujours affichée).
                    <br>
                    Vous retrouvez la liste des commandes dans la section <strong>commande</strong> de la <strong>Console</strong>.
                </p>
            </section>

            <figcaption>- LE THUAUT MORGAN -</figcaption>
        </figure>

        <div
        class="choice"
        >
            <button
            type="button"
            title="conseillé"
            on:click={ecopopup_setMode.bind(true)}
            >
                PASSER EN MODE ÉCO
            </button>

            <button
            type="button"
            title="déconseillé"
            on:click={ecopopup_setMode.bind(false)}
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
    /* #USES */

    @use '../../assets/scss/styles/flex' as *;
    @use '../../assets/scss/styles/position' as *;
    @use '../../assets/scss/styles/size' as *;
    @use '../../assets/scss/styles/background' as *;
    @use '../../assets/scss/styles/font' as *;
    @use '../../assets/scss/styles/cursor' as *;
    @use '../../assets/scss/styles/media' as *;

    /* #ECOPOPUP */

    .eco-popup
    {
        @include f-center(true);
        @include f-column;
        @include xy-start;
        @include any;
        @include black-glass(hue-rotate(180deg) blur(20px));

        position: fixed;

        padding-top: 40px;

        box-sizing: border-box;

        transition: backdrop-filter .2s, opacity .4s;

        &>section { width: 95%; }

        h3
        {
            @include h-($secondary, 18px, 1.2);

            text-align: right;
        }

        h4 { @include h-($light, 16px, 1.2); }

        .content { margin-block: 8px; }
    
        .content>section
        {
            padding-inline: 15px;

            border-left: solid $secondary 2px;

            box-sizing: border-box;
        }

        p, figcaption
        {
            @include f-content;

            font-size: 11px;
            font-weight: 100;
            line-height: 1.2;
            text-align: justify;
        }
        p
        {
            @include f-content;

            margin-bottom: 8px;

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
            @include p-interact;
            @include pointer;
    
            margin-bottom: 8px;
            padding: 4px 8px;
    
            background-color: transparent;

            box-sizing: border-box;

            @include media-min(425px, 325px) { padding: 8px 15px; }
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

        @include media-min(false, 375px)
        {
            h3
            {
                font-size: 24px;
                line-height: 1.3;
                text-align: left;
            }

            h4 { margin-bottom: 6px; }
        }
        @include media-min(375px, 768px)
        {
            &>section { width: 90%; }

            h3 { font-size: 34px; }

            h4
            {
                @include h-3($light);

                margin-bottom: 8px;
            }

            p, figcaption
            {
                font-size: 18px;
                line-height: 1.3;
            }
        }
        @include media-min(768px, 768px)
        {
            h3 { font-size: 48px; }

            p { margin-bottom: 15px; }

            .content
            {
                margin-block: 50px 40px;
                margin-left: 5%;
            }

            .content>section { padding-inline: 50px; }
        }
        @include media-min(1440px, 768px)
        {
            &>section { width: 50%; }
        }
    }
</style>