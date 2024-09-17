import type {NextApiRequest, NextApiResponse} from 'next';
import type {RespostaPadraoMsg} from '../../types/RespostaPadraoMsg';
import type {CadastroRequisicao} from '../../types/CadastroRequisicao';
import {UsuarioModel} from '../../models/usuarioModel';
import { conectarMongoDB } from '@/middlewares/conectarMongoDB';
import {upload, uploadImagemCosmic} from '../../services/uploadImagemCosmic';
import nc from 'next-connect';
import md5 from 'md5';


const handler = nc()
    .use(upload.single("file"))
    .post(async (req : NextApiRequest, res : NextApiResponse<RespostaPadraoMsg>) => {{
        const usuario = req.body as CadastroRequisicao;
    
            if(!usuario.nome || usuario.nome.length < 2){
                return res.status(400).json({erro : 'Nome invalido'});
            }
            if(!usuario.email || usuario.email.length < 5
                || !usuario.email.includes('.')){
                    return res.status(400).json({erro : 'E-mail invalido'});
                }
            if(!usuario.senha || usuario.senha.length < 4){
                return res.status(400).json({erro : 'Senha invalida'});
            }
    
            //validacao se ja existe usuario com o mesmo email
            const usuariosComMesmoEmail = await UsuarioModel.find({email : usuario.email});
            if(usuariosComMesmoEmail && usuariosComMesmoEmail.length > 0){
                return res.status(400).json({erro : 'Ja existe uma conta com o e-mail informado'});
            }
    
            //enviar a imagem do multer para o cosmic
            const image = await uploadImagemCosmic(req);

            //salvar no banco de dados
            const usuarioASerSalvo = {
                nome: usuario.nome,
                email: usuario.email,
                senha: md5(usuario.senha),
                avatar: image?.image?.url
            }
            await UsuarioModel.create(usuarioASerSalvo);
            return res.status(200).json({msg : 'Usuario criado com sucesso'})
        }});

// Configurando para que o NEXT não mande uma request com um JSON, por estarmos enviando uma foto é necessário que seja um FormData
export const config = { 
    api: {
      bodyParser: false,
    },
  };

export default conectarMongoDB(handler);