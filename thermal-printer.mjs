import ThermalPrinter from 'node-thermal-printer'
import nodeprinter from '@thiagoelg/node-printer'

async function example() {
    let printer = new ThermalPrinter.printer({
        type: ThermalPrinter.types.EPSON,              // 'star' or 'epson'
        interface: "printer:'BIXOLON_BK3_3'",
        driver: nodeprinter,
        options: {
            timeout: 1000
        },
        width: 48,                      // Number of characters in one line (default 48)
        characterSet: "PC858_EURO",       // Character set default SLOVENIA
        removeSpecialCharacters: false, // Removes special characters - default: false
        lineCharacter: "-",             // Use custom character for drawing lines
    });

    printer.alignLeft();
    printer.newLine();
    printer.println("Etant pensionnée, je n&rsquo;ai pas vécu de souci par rapport à une vie professionnelle. Par contre, j&rsquo;ai 3 choses à dire sur le plan de mon expérience. Je suis « aidant proche » à 2 égards: primo, je m&rsquo;occupe de ma tante (pas d&rsquo;enfants, 90 ans) en résidence service. L&rsquo;isolement y est extrême, son moral et son état physique se détériorent à vive allure. Secundo: j&rsquo;ai un fils de 39 ans, souffrant d&rsquo;une maladie psychique grave et invalidante. Le contexte a aggravé sa solitude et son moral. Je suis fort sollicitée à cet égard. Et enfin, je suis présidente d&rsquo;une association de familles ayant un proche atteint de troubles psychiques. Il s&rsquo;agit de Similes Wallonie: nous avons des groupes de parole et je peux vous dire que les constats concernant les usagers en santé mentale sont graves: difficultés d&rsquo;hospitalisation, diminution des liens sociaux, via les clubs thérapeutiques, manque d&rsquo;activités, rechutes etc etc. Les parents sont dans de graves difficultés supplémentaires à cause de la pandémie. Et cela me touche car j&rsquo;ai une grande partie de ma vie qui est consacrée à toutes ces personnes.");
    printer.drawLine();
    
    printer.cut();
    printer.append(Buffer.from('\x1D\x65\x05'));
    
    try {
        await printer.execute();
        console.log("Print success.");
    } catch (error) {
        console.error("Print error:", error);
    }
}


await example();