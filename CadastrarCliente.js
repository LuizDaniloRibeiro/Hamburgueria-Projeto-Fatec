class Cliente
{
    constructor(key, codigo, nome, telefone, endereco, cidade)
    {
        this.key      = key;
        this.codigo   = codigo;
        this.nome     = nome;
        this.telefone = telefone;
        this.endereco   = endereco;
        this.cidade  = cidade;
    }
}

//variavel global
var clientes = [];
var clienteEdicao = null;
var rowEditar = null;


//variaveis Banco De dados
const dbRef  = firebase.database().ref(); 
const cliRef = dbRef.child('clientes');


cliRef.on("child_added", snap => {
    
    let c = snap.val();
    c.key = snap.key;
    clientes.push(c);
    AddClienteGUI(c)
});


function Cadastrar()
{
    let burgLdr = Burg();
    let sucoLDR = Suco();
    let TurbLdr = Turbinar()
    let obs =  document.getElementById("IdObs").value;
    let result = burgLdr + sucoLDR + TurbLdr;
    

    if(clienteEdicao == null)//salva um novo cliente
    {
        let codigo = parseInt(document.getElementById("IdCodigo").value);

        if(pesquisaCliente(codigo) == null)
        {
            
            let cliente = new Cliente();

            cliente.codigo   = parseInt(document.getElementById("IdCodigo").value);
            cliente.nome     = document.getElementById("IdNome").value;
            cliente.telefone = document.getElementById("IdTelefone").value;
            cliente.endereco = document.getElementById("IdEndereco").value;
            cliente.cidade   = document.getElementById("IdCidade").value;

            //clientes.push(cliente);

            
            //AddClienteGUI(cliente);
            LimparFormGUI();

            cliRef.push({
                "codigo"   : cliente.codigo,
                "nome"     : cliente.nome,
                "telefone" : cliente.telefone,
                "endereco" : cliente.endereco,
                "cidade"   : cliente.cidade
            }); 
            
            
            alert(`
                Lanche: ${burgLdr}
                Bebidas: ${sucoLDR}
                Turbinar: ${TurbLdr}
                Oberservação: ${obs}
                Valor Final: ${result}
                Cliente Cadastrado com Sucesso! 
            `)
        }
        else
        {
            alert("Código já cadastrado!");
        }
    }
    else //edita um cliente
    {
        clienteEdicao.nome     = document.getElementById("IdNome").value;
        clienteEdicao.telefone = document.getElementById("IdTelefone").value;
        clienteEdicao.endereco = document.getElementById("IdEndereco").value;
        clienteEdicao.cidade   = document.getElementById("IdCidade").value;
         
        cliRef.child(clienteEdicao.key).update({
            "nome"     : clienteEdicao.nome,
            "telefone" : clienteEdicao.telefone,
            "endereco" : clienteEdicao.endereco,
            "cidade"   : clienteEdicao.cidade
        });
        
        
        rowEditar.cells[1].innerHTML = clienteEdicao.nome;
        rowEditar.cells[2].innerHTML = clienteEdicao.telefone;
        rowEditar.cells[3].innerHTML = clienteEdicao.endereco;
        rowEditar.cells[4].innerHTML = clienteEdicao.cidade;

        clienteEdicao = null;
        rowEditar = null;
        document.getElementById("IdCodigo").readOnly = false;

        LimparFormGUI();
        alert(`
        Lanche: ${burgLdr}
        Bebidas: ${sucoLDR}
        Turbinar: ${TurbLdr}
        Oberservação: ${obs}
        Valor Final: ${result}
        Cliente Atualizado! 
    `)
    }

}

//ADD um objto cliente
function AddClienteGUI(cliente)
{
    let tabela        = document.getElementById("IdtabelaCliente");
    let linha         = tabela.insertRow(clientes.length);
    
    let cellCodigo     = linha.insertCell(0);
    let cellNome       = linha.insertCell(1);
    let cellTelefone   = linha.insertCell(2);
    let cellEndereco   = linha.insertCell(3);
    let cellCidade     = linha.insertCell(4); 
    let cellBtnRemover = linha.insertCell(5);

    cellCodigo.innerHTML   = cliente.codigo;
    cellNome.innerHTML     = cliente.nome;
    cellTelefone.innerHTML = cliente.telefone;
    cellEndereco.innerHTML = cliente.endereco;
    cellCidade.innerHTML   = cliente.cidade;

    AddBotoesLinhaTabelaGUI(cellBtnRemover, cliente)
}


//função limpar
function LimparFormGUI()
{
    document.getElementById("IdForm").reset()
}


//Função Editar
function editarCliente(row, cliente)
{
    clienteEdicao = cliente;
    rowEditar = row;
    document.getElementById("IdCodigo").value   = cliente.codigo;
    document.getElementById("IdNome").value     = cliente.nome;
    document.getElementById("IdTelefone").value = cliente.telefone;
    document.getElementById("IdEndereco").value   = cliente.endereco;
    document.getElementById("IdCidade").value  = cliente.cidade;
    document.getElementById("IdCodigo").readOnly = true;
    
}


//Função validação
function pesquisaCliente(codigo)
{
    for(let i = 0; i < clientes.length; i++)
    {
        if(clientes[i].codigo == codigo)
        {
            return clientes[i];    
        }
    }

    return null;
}


//Função Remover
function removerCliente(rowIndex, cliente)
{

    for(let i=0; i < clientes.length; i++)
    {
        if(clientes[i].codigo == cliente.codigo)
        {
            clientes.splice(i, 1);
        }
    }

    //repurar referencia
    cliRef.child(cliente.key).remove();

    document.getElementById("IdtabelaCliente").deleteRow(rowIndex);
}


//add Botões da linha da tabela GUI
function AddBotoesLinhaTabelaGUI(cell, cliente)
{

    //Botão Remover
    let BtnRemBotao       = document.createElement("BUTTON");
    BtnRemBotao.innerHTML = "Excluir";
    BtnRemBotao.name      = "BtnRemBotao";
    BtnRemBotao.onclick   = function()
    {
        removerCliente(cell.parentNode.rowIndex, cliente)
    }

    cell.appendChild(BtnRemBotao);

    cell.appendChild(document.createTextNode(" "));

    //Botão Editar
    let BtnEditar = document.createElement("BUTTON");
    BtnEditar.innerHTML = "Editar";
    BtnEditar.name = "BtnEdiBotao";
    BtnEditar.onclick = function()
    {
        editarCliente(cell.parentNode, cliente)
    }

    cell.appendChild(BtnEditar);

}



//================ Valor Final =============\\


//função lanche
function Burg(){

    let burg = parseFloat(document.getElementById("IdLanche").value)

    return burg;
}

//função lanche
function Suco(){
 
    let suco = parseFloat(document.getElementById("IdBebidas").value);
    
    return suco;
}


//função turbinar
function Turbinar(){
   
    let turbinar = document.getElementsByName("turbinar")
    let total_Turb = 0;

    for(let i = 0; i < turbinar.length; i++){
        if(turbinar[i].checked){
            total_Turb += parseFloat(turbinar[i].value)
        }
        
    }

    return total_Turb;
}