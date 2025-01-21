const calculoBanco = (horasTrabalhadas, horasMeta,quantidadeDiasExpediente,quantidadeDiasFiltro,quantidadeAtestado,quantidadeFerias,quantidadeFeriado) => {
  // Converte as horas e minutos para minutos
  const horasTrabalhadasEmMinutos = (Math.floor(horasTrabalhadas / 60) * 60) + (horasTrabalhadas % 60);
  const horasMetaEmMinutos = (Math.floor(horasMeta / 60) * 60) + (horasMeta % 60);
  const horasDiarias = horasMetaEmMinutos/quantidadeDiasExpediente
  const metaFiltro = horasDiarias * quantidadeDiasFiltro
  const atestadosMinutos = horasDiarias * quantidadeAtestado
  const feriasMinutos = horasDiarias * quantidadeFerias
  const feriadoMinutos = horasDiarias * quantidadeFeriado
  const minutosCompensados = atestadosMinutos + feriasMinutos + feriadoMinutos
  const metaTotal = metaFiltro - minutosCompensados
  const difHora = horasTrabalhadasEmMinutos - metaTotal;
  let minutos = 0;

  // Define o saldo em minutos, positivo ou negativo
  switch (true) {
      case difHora > 0:
          minutos = difHora-60; // Horas extras
          break;
      case difHora < 0:
          minutos = difHora+60 // Horas faltantes
          break;
      default:
          minutos = 0; // Meta cumprida exatamente
  }

  // Função para converter minutos para formato hh:mm
  const formatarParaHoras = (minutoConversao) => {
      // Trunca os minutos para remover qualquer parte decimal
      minutoConversao = Math.floor(minutoConversao);  // Remove os decimais

      const horas = Math.floor(minutoConversao / 60);
      const minutosRestantes = Math.abs(minutoConversao % 60);
      return `${String(horas).padStart(2, '0')}:${String(minutosRestantes).padStart(2, '0')}`;
  };

  return {
    horasBanco: formatarParaHoras(minutos),
    Trabalhado: formatarParaHoras(horasTrabalhadasEmMinutos),
    horasDiarias: horasDiarias
  };
};

module.exports = { calculoBanco };
