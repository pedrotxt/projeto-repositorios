import styled, {keyframes, css} from 'styled-components';

export const Container = styled.div`
    max-width: 700px;
    background-color: #FFF;
    border-radius: 4px;
    box-shadow: 0 0 20px rgba(0,0,0, 0.2);
    padding: 30px;
    margin: 80px auto;

    h1{
        font-size: 20px;
        display: flex;
        flex-direction: row;
        align-items: center;

        svg{
            margin-right: 10px;
        }
    }
`;



export const Form = styled.form`
    margin-top: 30px;
    display: flex;
    flex-direction: row;

    input{
        flex: 1;
        // se error for true - vermelho / false - cinza
        border: 1px solid ${props => (props.error ? '#FF0000' : '#DDD')};
        padding: 10px 15px;
        border-radius: 4px;
        font-size: 17px;
    }
`;

//Criando animação do botão
const animate = keyframes`

    // da onde ele começa
    from{
        transform: rotate(0deg);
    }

    // até
    to{
        transform: rotate(360deg);
    }
`;

export const SubmitButton = styled.button.attrs(props => ({
    type: 'submit',
    // button tem essa props disabled que desabilita ele, se for 1 ele vai desativar
    disabled: props.loading,
}))`
    background: #0D2636;
    border: 0;
    border-radius: 4px;
    margin-left: 10px;
    padding: 0 15px;
    display: flex;
    justify-content: center;
    align-items: center;


    // acessando a propriedade com &[]
    &[disabled]{
        cursor: not-allowed;
        opacity: 0.5;
    }

    // se a props loading for true / vai colocar uma animação no icone svg
    ${props => props.loading &&
        css`
            svg{
                animation: ${animate} 2s linear infinite;
            }
        `
    }
`;

export const List = styled.form`
    list-style: none;
    margin-top: 20px;

    li{
        padding: 15px 0;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;

        // o primeiro li da lista ele vai ignorar e so vai aplicar do segundo pra baixo
        & + li{
            border-top: 1px solid #EEE;
        }

        a{
            color: #0D2636;
            text-decoration: none;
        }
    }
`;

export const DeleteButton = styled.button.attrs({
    type:'button'
})`
    background: transparent;
    color: #0D2636;
    border: 0;
    padding: 8px 7px;
    outline: 0;
    border-radius: 4px;
`;

