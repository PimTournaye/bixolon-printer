const printer = require('@thiagoelg/node-printer');

const PRINTER_NAME = 'BIXOLON_BK3_3'
let device = printer.getPrinter(PRINTER_NAME)






let testText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc eget dolor ac sem egestas luctus. Nullam finibus mollis interdum. Aliquam suscipit est quis leo vehicula congue. Nullam id tempus purus. Mauris molestie mauris velit, vitae porta metus ullamcorper ut. Etiam vel sapien sagittis, sagittis lacus in, scelerisque velit. Mauris vitae mauris sem. Quisque ullamcorper rhoncus nunc a dapibus. Integer dictum lorem magna, sed euismod lacus scelerisque ac. Fusce interdum tincidunt scelerisque. Aliquam et tellus nunc. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Cras arcu purus, iaculis eu sollicitudin ut, varius eget nibh. Ut ac euismod sem, eu pretium quam. In hac habitasse platea dictumst.

Vivamus in turpis sem. Integer semper in nunc eu molestie. In dignissim neque vel erat mollis, et eleifend nulla fermentum. Integer et lorem eget lectus rutrum convallis. In hac habitasse platea dictumst. Nam condimentum sed urna vel feugiat. Praesent ut iaculis ligula. Nam ultrices interdum felis id dapibus. Integer mi lectus, venenatis vitae enim vitae, tristique accumsan nibh. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.

Donec malesuada sagittis dapibus. Proin ut tempor lectus, cursus dictum tortor. Aenean at tellus vel sem elementum efficitur ultricies non metus. Aliquam imperdiet dolor est, a faucibus metus feugiat nec. Aliquam placerat metus vel tincidunt semper. Suspendisse finibus libero velit, ac facilisis ipsum dictum vel. Nam feugiat tincidunt lacus id euismod. Maecenas molestie laoreet tellus, in semper leo. In et malesuada nisi, at aliquam quam. In faucibus lectus turpis, eget sagittis nisl varius ac. Vestibulum aliquet libero ligula, at blandit dolor ultricies pellentesque. Sed aliquet, felis elementum ultricies pulvinar, sapien sem scelerisque ex, a viverra lorem sem ut orci.

Sed luctus diam mauris, eget aliquam justo tincidunt et. Pellentesque finibus nisi mauris, in cursus velit luctus id. Nulla aliquam, nibh sit amet consectetur varius, urna ipsum porta neque, et maximus justo metus nec lacus. Curabitur fermentum felis ac congue faucibus. Nunc ut suscipit lectus. Quisque placerat non erat vel porttitor. Vestibulum imperdiet, nisi et mollis feugiat, ipsum ipsum dictum nulla, non placerat nisi ligula ac metus. Maecenas cursus vitae sem non tincidunt. Cras cursus massa at ultricies egestas. In gravida nunc libero, at elementum augue facilisis non. Nunc a mollis ex. Donec euismod dui a est accumsan sodales. Nullam et tristique dui. Praesent vestibulum, massa id bibendum bibendum, ligula est semper orci, ut ornare lorem nunc at quam. Duis a nulla condimentum, aliquam risus id, rhoncus libero. In posuere nec elit non bibendum.

Fusce facilisis et ligula ut blandit. Suspendisse ac facilisis felis. Praesent consequat faucibus porttitor. Phasellus sed iaculis ex. Vivamus molestie efficitur consequat. Maecenas at dictum dolor. Cras malesuada fringilla risus. Suspendisse sed euismod nisi. Donec ut lorem a mi pharetra pretium quis eu lectus. Suspendisse vel arcu enim. Nunc efficitur lacus a dui porttitor sollicitudin. Suspendisse porttitor nunc at massa tincidunt cursus. Aenean quis lorem orci. Etiam at purus tristique, dictum orci ac, porttitor justo.`


let test2 = `Bercith van degelijke lengte, ik ga eens zien hoeveel \n tekens hoeveel lijnen gaan opmaken.

123456789012345678901234567890123456789012345678`
let leaf = `

       |
     .'|'.
    /.'|\ \
    | /|'.|
     \ |\/
      \|/
       '


      `
  
    

function printZebra(barcode_text, printer_name){
	printer.printDirect({
        data:barcode_text, 
        printer:printer_name,
        type: "RAW",
        success:function(){	console.log("printed: "+barcode_text);},
        error:function(err){console.log(err);}
	});
}

printZebra(test2, PRINTER_NAME);



/*
device.printDirect({data:"print from Node.JS buffer" // or simple String: "some text"
	, printer: device // printer name, if missing then will print to default printer
	, type: 'RAW' // type: RAW, TEXT, PDF, JPEG, .. depends on platform
	, success:function(jobID){
		console.log("sent to printer with ID: "+jobID);
	}
	, error:function(err){console.log(err);}
});*/