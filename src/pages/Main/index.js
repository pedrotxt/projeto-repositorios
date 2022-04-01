import React, { useState, useCallback, useEffect } from "react";

import { FaGithub, FaPlus, FaSpinner, FaBars, FaTrash } from "react-icons/fa";

import { Container, Form, SubmitButton, List, DeleteButton } from './styles';

import api from "../../services/api";

import { Link } from "react-router-dom";

export default function Main(){

    const [newRepo, setNewRepo] = useState('');
    const [repositorios, setRepositorios] = useState([]);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);

    // DidMount - Buscar
    useEffect(()=>{
        // buscando do localStorage tudo que ele tem e colocando dentro de repositorios. (repositorios reseta toda vez que a pagina é carregada denovo por isso preciso pegar os dados do localStorage toda vez que aplicação rodar)
        const repoStorage = localStorage.getItem('repos');

        // se tiver algo dentro de repoStorage faça:
        if(repoStorage){
            setRepositorios(JSON.parse(repoStorage));
        }
        // quando [] estiver vazio o useEffect vai executar na montagem da tela
    },[])

    // DidUpdate - Salvar alterações
    useEffect(()=>{
        // setando no meu localStorage a lista de repositorios
        localStorage.setItem('repos', JSON.stringify(repositorios));
        // quando [repositorios] sofrer alterações vai chamar o useEffect
    },[repositorios])

    // Com useCallBack =
    const handleSubmit = useCallback( (e)=>{
        e.preventDefault();

        async function submit(){
            setLoading(true);
            setAlert(null);
            try{

                if(newRepo === ''){
                    throw new Error('Você precisa indicar um repositorio!')
                }
                const response = await api.get(`repos/${newRepo}`);

                // varrendo meu array de repositorios e vendo se tem um r.name igual ao que ele digitou
                const hasRepo = repositorios.find(r => r.name === newRepo)
                if(hasRepo){
                    throw new Error('Repositorio duplicado!')
                }

                const data = {
                    name: response.data.full_name,
                }

                setRepositorios([...repositorios, data]);
                setNewRepo('');

            }catch(error){
                  // se o try der erro o setAlert vai fazer a border do input ficar vermelha
                setAlert(true);
                console.log(error);
            }finally{
                setLoading(false);
            }
        }

        submit();

        // Quando uma ou outra state for atualizada ele vai chamar esse useCallBack
    }, [newRepo, repositorios]);

    // Sem useCallBack =
    // async function handleSubmit(e){
    //     e.preventDefault();

    //     const response = await api.get(`repos/${newRepo}`);

    //     const data = {
    //         name: response.data.full_name,
    //     }

    //     setRepositorios([...repositorios, data])

    //     setNewRepo('');
    // }

    function handleInputChange(e){
        setNewRepo(e.target.value);
        // quando ele começar a digitar o alert vai voltar para null e 
        setAlert(null);
    }

    // essa repo vai receber o nome que eu to mandando pra ele
    const handleDelete = useCallback((repo)=>{
        // vai filtrar todo o repositorios e vai devolver para const find somente os repositorios que forem diferente desse que ele ta mandando pra essa função
        // ex: se o usuario tiver clicando no 1, e o 1 for angular/angular, ele ta mandando o nome angular/angular para o repo, essa função ta recebendo angular/angular, então ele vai verificar todos os repositorios que são diferentes de angular/angular e vai retornar dentro da constante find
        const find = repositorios.filter(r => r.name !== repo);
        // mandando todos os repositorios menos aquele que ele clicou
        setRepositorios(find);
    },[repositorios]) ;


     
    return(
        <Container>
          
          <h1>
              <FaGithub size={25}/>
              Meus Repositorios
          </h1>

          <Form onSubmit={handleSubmit} error={alert}>

              <input type="text" 
              placeholder="Adicionar Repositorios"
              value={newRepo}
              onChange={handleInputChange}
              />

              <SubmitButton loading={loading ? 1 : 0}>

                  {loading ? (
                      <FaSpinner color='#FFF' size={25} />
                  ) : (
                    <FaPlus size={25} color='#FFF' />
                  )}
                  
              </SubmitButton>

          </Form>

          <List>
              {/* Fazendo um map pra percorrer toda vez e montar a lista */}
              {repositorios.map( repo => (

                  <li key={repo.name}>

                      <span>
                          {/* Passando em função anonima pra não ser chamado toda vez */}
                          <DeleteButton onClick={()=> handleDelete(repo.name)}>
                              <FaTrash size={14} />
                          </DeleteButton>
                          {repo.name}
                      </span>

                      <Link to={`/repositorio/${encodeURIComponent(repo.name)}`}>
                          <FaBars size={20} />
                      </Link>

                  </li>
              ))}
          </List>

        </Container>
    )
    
}