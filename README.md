# Интерфейсные концепты AI-агента исполнителя услуг

Контекст: исполнитель услуг на классифайде настраивает агента, который общается с потенциальными клиентами от его имени.

## Файлы

1. `concept-1.png` — выбор режима агента, базовый набор тем с источниками данных и добавление расширенных тем.
2. `concept-2.png` — условия передачи исполнителю, сообщение клиенту и резюме.

Прототип переведён на React 18 + Vite и реальные компоненты дизайн-системы
Avito (`@avito/kitty`, `@avito/zna4ki`). Для запуска:

```bash
pnpm install
pnpm dev
```

Для установки внутренних пакетов нужен VPN DC и доступ к `npm.msk.avito.ru`.
Основная логика находится в `src/App.tsx`, раскладка — в `src/styles.css`.

## Рыночные паттерны

- **Роль и стиль:** готовые режимы, tone of voice и answer length — Intercom Fin, Zendesk AI Agents, Jivo.
- **Знания:** контент-библиотека, документы, источники ответа и исправление на естественном языке — Pleep, Intercom Fin, Zendesk.
- **Действия:** темы/действия и сценарии с интеграциями — Salesforce Agentforce, ChatAI/F5, JAICP.
- **Передача человеку:** правила эскалации, сбор контекста и резюме — Intercom Fin, Jivo, Zendesk.
- **Время:** follow-up, рабочие часы, waiting message и автозакрытие — Nextbot, Jivo, Intercom Fin.

## Рекомендуемый сценарий пользовательского теста

1. «Настройте агента, который просто отвечает клиентам об услуге».
2. «Добавьте собственное правило ответа в свободное поле».
3. «Настройте, когда агент должен вернуть разговор вам».

После каждого задания спросить:

- Что, по мнению участника, агент теперь может делать?
- Где ожидается подтверждение исполнителя?
- Какая настройка кажется опасной или непонятной?
- Хотел бы участник видеть готовые режимы или точные параметры?

## Источники

- https://www.intercom.com/help/en/articles/13177409-customize-fin-ai-agent-tone-of-voice-and-answer-length
- https://www.intercom.com/help/en/articles/12396892-manage-fin-ai-agent-s-escalation-guidance-and-rules
- https://support.zendesk.com/hc/en-us/articles/8357758773658-Customizing-the-identity-tone-of-voice-and-pronoun-formality-for-an-AI-agent
- https://www.jivo.ru/help/ai-features/ai-agent.html
- https://www.jivo.ru/help/ai-features/nastrojki-avtomatizacii-ii-operatora.html
- https://doc.nextbot.ru/functional/setting-up-agent
- https://pleep.app/ru/features/improvement
- https://help.salesforce.com/s/articleView?id=ai.agent_testing_center.htm&language=en_US&type=5
