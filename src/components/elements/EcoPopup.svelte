<!-- #SCRIPT -->

<script>
    // #IMPORT

        // --CONTEXT
        import { app } from '../field/Main.svelte'

    // #VARIABLES

        // --ELEMENT-POPUP
        let
        ecopopup_POPUP,
        ecopopup_OPACITY = 1,
        ecopopup_BLUR = 20

    // #FUNCTIONS

        // --SET
        function ecopopup_setMode()
        {
            app.app_eco(this)
            
            ecopopup_clear()
        }
    
        // --CLEAR
        function ecopopup_clear()
        {
            ecopopup_OPACITY = 0
            ecopopup_BLUR = 0

            setTimeout(() => ecopopup_POPUP.remove(), 1000)
        }
</script>

<!-- #HTML -->

<div
class="eco-popup"
style:--blur="blur({ecopopup_BLUR}px)"
style:opacity={ecopopup_OPACITY}
bind:this={ecopopup_POPUP}
>
    <section>
        <h3>
            RESSOURCES LIMITÉES :/
        </h3>

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

    /* #ECOPOPUP */

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

        h3 { @include h-($light, 48px, 48px); }

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
            @include f-content;

            font-size: 18px;
            font-weight: 100;
            line-height: 22px;
        }
        p
        {
            @include f-content;

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