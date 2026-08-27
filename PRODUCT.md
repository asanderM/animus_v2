# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Pequenos negócios locais no Vale do Paranhana, RS (Taquara e região) — donos/gestores sem estrutura técnica, que perdem venda por demora no atendimento WhatsApp ou por gestão de clientes bagunçada (planilhas soltas, agenda de papel). Público genérico por enquanto — sem recorte de nicho vertical (confirmado; projetos irmãos como Barber CRM já vão por nicho específico, mas este site continua servindo qualquer negócio local).

## Product Purpose

Landing page institucional que vende diagnóstico gratuito para uma implementação fechada de atendimento automático (WhatsApp) + organização de clientes, com site institucional incluso como bônus. Sucesso = visitante entra em contato via WhatsApp para agendar o diagnóstico gratuito.

## Positioning

Não vende ferramentas separadas nem site avulso — entrega o ecossistema digital do negócio numa implementação única e fechada (atendimento automático 24h + painel de clientes + site institucional, este último como bônus, não item de peso igual). Diferença de um concorrente que venderia "site" ou "chatbot" isolado: aqui o problema é tratado como um problema só, resolvido de uma vez, sem upsell fragmentado nem menção às ferramentas internas usadas (n8n, Supabase, Evolution API) na comunicação com o cliente.

## Operating Context

- Atendimento no WhatsApp é o canal principal de conversão (botão flutuante + CTAs); número fixo (51) 99320-3344.
- Todo CTA leva à mesma ação: "diagnóstico gratuito", nunca preço direto no site.
- Modal de qualificação (3 checkboxes de dor + campo livre) roda antes de abrir o WhatsApp no CTA Final — hoje só compõe a mensagem em JS, sem persistência real (integração Supabase/n8n ainda é `// TODO`).
- Calendly já implementado no código mas oculto (conta é placeholder) — decisão pendente entre reativar com conta real ou migrar para agendamento conectado ao Supabase.

## Capabilities and Constraints

- Stack: HTML puro + Tailwind via CDN, arquivo único (`index.html`), sem build, sem framework, sem `package.json`.
- Sem preços nem tabela de planos expostos no site — precificação é discutida só depois do diagnóstico.
- Nunca citar nomes de ferramentas internas (n8n, Supabase, Evolution API) na copy visível ao usuário final.
- Proibido usar termos genéricos de marketing vazio: "transformação digital", "solução inovadora", "ecossistema", "sinergias".
- Copy sempre em PT-BR, tratamento "você"/"seu negócio".

## Brand Commitments

- Nome: Animus AI Studio. Domínio de produção: animusai.com.br.
- Mascote: pinguim sobre gelo com círculo dourado (gold-foil), usado no nav e no CTA Final.
- Assinatura de rodapé em JetBrains Mono: "[Foco • Código • Evolução]".
- Elementos visuais de identidade "terminal/tech" (colchetes `[ ]`, prompt `>_`, cursor piscando) já são compromisso de marca estabelecido — ver `.claude/rules/design-system-animus.md` para a especificação visual completa (paleta, tipografia, componentes).

## Evidence on Hand

Nenhuma prova social real existe ainda (confirmado) — sem depoimento, case ou número de cliente atendido. Regra ativa: nunca fabricar depoimento ou prova social; trabalho futuro deve manter o site sem essas seções até haver conteúdo real.

## Product Principles

1. Um problema, uma implementação — nunca fragmentar a oferta em peças vendidas separadamente (site não é produto autônomo, é bônus).
2. Diagnóstico antes de preço — toda conversão leva a uma conversa, nunca a uma tabela de valores.
3. Sem enfeite de marketing genérico nem prova social inventada — copy direta, PT-BR, sem jargão técnico interno exposto ao cliente final.
4. Consistência de marca entre propriedades Animus (mascote pinguim, paleta gold/carbon, tipografia mono/terminal) — mudanças visuais aqui devem se manter compatíveis com `animus_dashboard_next` e demais produtos irmãos.

## Accessibility & Inclusion

Nenhum requisito específico de acessibilidade foi levantado até agora além de `prefers-reduced-motion` (já respeitado no CSS existente) e mobile-first funcional (DoD do projeto exige interface usável a partir de 360px de largura).
