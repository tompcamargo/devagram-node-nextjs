import type { NextApiRequest, NextApiResponse } from "next";
import type { RespostaPadraoMsg } from "@/types/RespostaPadraoMsg";
import { validarTokenJWT } from "@/middlewares/validarTokenJWT";
import { conectarMongoDB } from "@/middlewares/conectarMongoDB";
import { UsuarioModel } from "@/models/usuarioModel";
import { PublicacaoModel } from "@/models/PublicacaoModel";

const feedEndPoint = async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg | any>) => {
    try {
        if(req.method === 'GET'){
            if(req?.query?.id){
                // agora que tenho id do usuario como valido se o usuario e valido
                const usuario = await UsuarioModel.findById(req?.query?.id);
                if(!usuario){
                    res.status(400).json({erro : "Usuario nao encontrado"})
                }
                // como buscar suas publicacoes?
                const publicacoes = await PublicacaoModel
                .find ({idUsuario : usuario._id})
                .sort({data : -1});

                return res.status(200).json(publicacoes);
            }

            // receber uma informacao do id do usuario que eu quero buscar o feed
            // onde vem essa informacao?

        }
        res.status(405).json({erro : "Metodo informado nao e valido"})
    }catch(e){
        console.log(e);
    }

    res.status(400).json({erro : "Nao foi possivel obter o feed"})
}

export default validarTokenJWT(conectarMongoDB(feedEndPoint));