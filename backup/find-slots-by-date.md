# Buscar Slots por data

> ## Caso de sucesso

1. ✅ Recebe uma requisição do tipo **GET** na rota **/slots/hours**
2. ✅ Valida dados obrigatórios **unitId**, **itemId**, **isKit** e **date**
3. ✅ **Busca** por slots disponíveis no SGH
4. ✅ Retorna **200**, com dados dos slots encontrados

> ## Exceções

1. ✅ Retorna erro **204** se nenhum slot estiver disponível
2. ✅ Retorna erro **500** se der erro ao buscar por slots disponíveis
