const db = require('../../database/database')
const jornada = require('./jornadaInfoService')
const banco = require('./calculoBancoHoras')

const verificarDiaTrabalho = (data, diasJornada) => {
    data = new Date(data)
    const diasSemana = ["domingo", "segunda", "terca", "quarta", "quinta", "sexta", "sabado"];
    const diaSemana = data.getDay();  // Identifica o dia da semana da data
    const diaAtual = diasSemana[diaSemana] 
    const expediente = diasJornada[diaAtual];
    return expediente
};

const verificarAtestado = (HoraInicio,HoraAlmoco,HoraRetorno,HoraFim) =>{
    if (HoraInicio === "01:01:01" && HoraInicio === HoraAlmoco && HoraInicio === HoraRetorno && HoraInicio === HoraFim) {
        return true
    }else{
        return false
    }
}

const verificarFerias = (HoraInicio,HoraAlmoco,HoraRetorno,HoraFim) =>{
    if (HoraInicio === "02:02:02" && HoraInicio === HoraAlmoco && HoraInicio === HoraRetorno && HoraInicio === HoraFim) {
        return true
    }else{
        return false
    }
}

const verificarFeriado = (HoraInicio,HoraAlmoco,HoraRetorno,HoraFim) =>{
    if (HoraInicio === "02:02:02" && HoraInicio === HoraAlmoco && HoraInicio === HoraRetorno && HoraInicio === HoraFim) {
        return true
    }else{
        return false
    }
}



const formatDateToBR = (dateInput) => {
    if (dateInput instanceof Date) {
        const day = String(dateInput.getDate()).padStart(2, '0');
        const month = String(dateInput.getMonth() + 1).padStart(2, '0');
        const year = dateInput.getFullYear();
        return `${day}/${month}/${year}`;
    }
    if (typeof dateInput === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateInput)) {
        const [year, month, day] = dateInput.split('-');
        return `${day}/${month}/${year}`;
    }
    return dateInput;
};

const horasTrabalhadas = (inicioHora, fimHora) => {
    if (!inicioHora || !fimHora) {
        return 0;
    }
    const inicio = new Date(`2024-11-07T${inicioHora}`);
    const fim = new Date(`2024-11-07T${fimHora}`);
    
    const segundosTrabalhados = (fim - inicio)/1000
    const minutosTrabalhados = segundosTrabalhados/60
    return minutosTrabalhados
};

const buscarPonto = async (DataInicio,DataFim,EmployeeId,target,user) => {
    try {


        const inicioData = new Date(DataInicio);
        const fimData = new Date(DataFim);
        const conn = await db.conectar(target,user);
        const jornadaSemanal = await jornada.infoJornada(target,EmployeeId,user)
        
        const HoraSemanal = jornadaSemanal.Horas
        let quantidadeDiasFiltro = 0 
        let totalHoras = 0
        let quantidadeAtestado = 0
        let quantidadeFerias = 0
        let quantidadeFeriado = 0
        const query = `
           WITH RECURSIVE Dates AS (
    SELECT CAST(? AS DATE) AS Date
    UNION ALL
    SELECT DATE_ADD(Date, INTERVAL 1 DAY)
    FROM Dates
    WHERE Date < CAST(? AS DATE) -- Remova a adição de um dia aqui
)
SELECT d.Date,
       r.id,
       r.HoraInicio,
       r.HoraAlmoco,
       r.HoraRetorno,
       r.HoraFim
FROM Dates d
LEFT JOIN RegistroPonto r
ON d.Date = r.Data AND r.FuncionarioID = ?
ORDER BY d.Date
        `;

        const [rows] = await conn.execute(query, [inicioData, fimData, EmployeeId]);
        
        const result = rows.map(row => {
            const dataAtual = new Date(row.Date)
            const atestado = verificarAtestado(row.HoraInicio,row.HoraAlmoco,row.HoraRetorno,row.HoraFim)
            const ferias = verificarFerias(row.HoraInicio,row.HoraAlmoco,row.HoraRetorno,row.HoraFim)
            const feriado = verificarFeriado(row.HoraInicio,row.HoraAlmoco,row.HoraRetorno,row.HoraFim)
            const diaTrabalho = verificarDiaTrabalho(dataAtual,JSON.parse(jornadaSemanal.diasJornada))
            if(diaTrabalho) quantidadeDiasFiltro++;
            if(atestado) quantidadeAtestado++;
            if(ferias) quantidadeFerias++;
            if(feriado) quantidadeFeriado++;
            const minutosManha = horasTrabalhadas(row.HoraInicio,row.HoraAlmoco)
            const minutosTarde = horasTrabalhadas(row.HoraRetorno,row.HoraFim)
            const almoco = horasTrabalhadas(row.HoraAlmoco,row.HoraRetorno)
            const horasTotais = (minutosManha + minutosTarde)
            totalHoras = totalHoras + horasTotais
   
            const formatHoras = (minutos) => {
                const horas = Math.floor(minutos / 60);  // Obtém as horas inteiras
                const minutosRestantes = Math.round(minutos % 60);  // Obtém os minutos restantes (arredondado)
                
                return `${String(horas).padStart(2, '0')}:${String(minutosRestantes).padStart(2, '0')}`;
            };
            
            let totalFormatado = formatHoras(horasTotais)
            let almocoFormatado = formatHoras(almoco)
            
            if(totalFormatado=='00:60'){
              totalFormatado = '01:00'
            }

            if(almocoFormatado=='00:60'){
                almocoFormatado = '01:00'
            }




            return {
                Data: formatDateToBR(row.Date),
                id: row.id,
                HoraInicio: row.HoraInicio,
                HoraAlmoco: row.HoraAlmoco,
                HoraRetorno: row.HoraRetorno,
                HoraFim: row.HoraFim,
                horasTrabalhadas:totalFormatado,
                tempoAlmoco:almocoFormatado,
                expediente: diaTrabalho,
                total: totalHoras
              
            };
        });

        await conn.end();
        const bancoHoras = banco.calculoBanco(totalHoras,HoraSemanal,jornadaSemanal.quantidadeDiasExpediente,quantidadeDiasFiltro,quantidadeAtestado,quantidadeFerias,quantidadeFeriado)   
        return {
            statusCode: 200,
            message: "Ponto Encontrado!",
            bancoHoras: bancoHoras.horasBanco,
            Trabalhado: bancoHoras.Trabalhado,
            teste: jornadaSemanal.quantidadeDiasExpediente,
            data: result
             
        };

    } catch (error) {
        console.error('Erro:', error);  // Log detalhado do erro
        return {
            statusCode: 500,
            message: error.message,
                    };
    }
};

module.exports = { buscarPonto };
