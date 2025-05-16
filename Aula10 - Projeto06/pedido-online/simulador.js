
function validarForm_confirmarPedido(){

    //validacoes do formulario

    var cliente_nome = document.getElementById("cliente_nome").value
    var cliente_endereco = document.getElementById("cliente_endereco").value


    if (cliente_nome == ""){
        alert("Por favor, informe o seu nome.")
        return false; // Impede o envio do formulário
    }

    else if (cliente_endereco == ""){
        alert("Por favor, informe o seu endereço.")
        return false; // Impede o envio do formulário
    }


    //calculo do total a pagar  

    var total_a_pagar = 0

    var item_pizza_grande = document.getElementById("item_pizza_grande").checked
    var item_pizza_media = document.getElementById("item_pizza_media").checked
    var item_pizza_pequena = document.getElementById("item_pizza_pequena").checked
    var item_refrigerante_2L = document.getElementById("item_refrigerante_2L").checked



    if (item_pizza_grande == true){

        var qtd_pizza_grande = document.getElementById("qtd_pizza_grande").value

        total_a_pagar = total_a_pagar + qtd_pizza_grande * 60
    }

    if (item_pizza_media == true){

        var qtd_pizza_media = document.getElementById("qtd_pizza_media").value

        total_a_pagar = total_a_pagar + qtd_pizza_media * 50
    }

    if (item_pizza_pequena == true){

        var qtd_pizza_pequena = document.getElementById("qtd_pizza_pequena").value

        total_a_pagar = total_a_pagar + qtd_pizza_pequena * 40
    }

    if (item_refrigerante_2L == true){

        var qtd_refrigerante_2L = document.getElementById("qtd_refrigerante_2L").value

        total_a_pagar = total_a_pagar + qtd_refrigerante_2L * 10
    }

    //calculo da taxa de entrega
    //entrega por motoboy ou entrega no balcao da loja ao cliente
    var radioBoxes = document.getElementsByName("tipo_entrega");
    
    for (var i = 0; i < radioBoxes.length; i++) {
        if (radioBoxes[i].checked) {

            if(radioBoxes[i].value == "por_motoboy"){
                total_a_pagar = total_a_pagar + 10
            } 

            if(radioBoxes[i].value == "balcao"){
                total_a_pagar = total_a_pagar + 0
            } 

        }
    }


    var opcao = confirm("Total a pagar R$ " + total_a_pagar + " - Confirma o envio do pedido?")

    if (opcao == true){
        //alert("Pedido enviado com sucesso")
        return true
    }
    else {
        alert("Pedido não enviado")
        return false
    }
    

   
}