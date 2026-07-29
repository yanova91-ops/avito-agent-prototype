import { useState } from 'react';
import {
  Button,
  H1,
  H2,
  H3,
  Input,
  Modal,
  P,
  Span,
  Switcher,
  TabGroup,
} from '@avito/kitty';
import {
  AssistantChatsIcon,
  ChatOutlineIcon,
  HomeIcon,
  ServicesIcon,
  SettingsOutlineIcon,
  WalletIcon,
} from '@avito/zna4ki/kvadratiki';

type Screen = 'answers' | 'handoff';
type HandoffCondition = {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
};

const initialTopics = [
  {
    id: 'price',
    title: 'Консультация по цене',
    description: 'Назвать стоимость услуги и объяснить, от чего она зависит',
    sources: ['Цена из объявления', 'Цена из прайс-листа'],
  },
  {
    id: 'schedule',
    title: 'Загруженность графика',
    description: 'Подсказать ближайшее свободное время исполнителя',
    sources: ['График исполнителя'],
  },
  {
    id: 'service',
    title: 'Вопросы об услуге',
    description: 'Ответить про сроки, гарантию и используемые материалы',
    sources: ['Объявление', 'Описание услуги'],
  },
];

export function App() {
  const [screen, setScreen] = useState<Screen>('answers');
  const [enabledTopics, setEnabledTopics] = useState(() => initialTopics.map((topic) => topic.id));
  const [customTopics, setCustomTopics] = useState<
    Array<{ id: string; title: string; source: string; enabled: boolean }>
  >([]);
  const [topicModalOpen, setTopicModalOpen] = useState(false);
  const [draftTitle, setDraftTitle] = useState('');
  const [draftSource, setDraftSource] = useState('');
  const [draftEnabled, setDraftEnabled] = useState(true);
  const [saved, setSaved] = useState(false);
  const [handoffConditions, setHandoffConditions] = useState<HandoffCondition[]>([
    {
      id: 'ask',
      title: 'Клиент прямо просит исполнителя',
      description: 'Например, хочет обсудить детали лично или просит ваш номер',
      enabled: true,
    },
    {
      id: 'discount',
      title: 'Нужно согласовать скидку или запись',
      description: 'Агент не обещает скидку и не подтверждает время без вас',
      enabled: true,
    },
    {
      id: 'unknown',
      title: 'Нет подтверждённого ответа',
      description: 'В источниках агента недостаточно данных, чтобы ответить точно',
      enabled: true,
    },
    {
      id: 'negative',
      title: 'Клиент недоволен',
      description: 'В диалоге появилась претензия или негативная оценка',
      enabled: true,
    },
  ]);
  const defaultHandoffMessage =
    'Спасибо! Передаю ваш вопрос исполнителю. Он продолжит общение здесь, в чате.';
  const [handoffMessage, setHandoffMessage] = useState(defaultHandoffMessage);
  const [handoffDraft, setHandoffDraft] = useState(defaultHandoffMessage);
  const [handoffModalOpen, setHandoffModalOpen] = useState(false);
  const [topicAnswers, setTopicAnswers] = useState<Record<string, string>>({
    price:
      'Стоимость услуги — от 3 500 ₽. Точная цена зависит от объёма работ и материалов. Расскажите подробнее о задаче — я помогу рассчитать стоимость.',
    schedule:
      'Ближайшее свободное время — в четверг после 16:00 или в субботу утром. Какой вариант вам удобнее?',
    service:
      'Работа занимает около двух дней. Используем материалы из вашего прайс-листа и даём гарантию 12 месяцев.',
  });
  const [activeAnswerTopicId, setActiveAnswerTopicId] = useState<string | null>(null);
  const [answerDraft, setAnswerDraft] = useState('');

  const toggleTopic = (id: string) => {
    setEnabledTopics((current) =>
      current.includes(id) ? current.filter((topicId) => topicId !== id) : [...current, id],
    );
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2200);
  };

  const addCustomTopic = () => {
    if (!draftTitle.trim() || !draftSource.trim()) return;
    setCustomTopics((current) => [
      ...current,
      {
        id: `${Date.now()}`,
        title: draftTitle.trim(),
        source: draftSource.trim(),
        enabled: draftEnabled,
      },
    ]);
    setDraftTitle('');
    setDraftSource('');
    setDraftEnabled(true);
    setTopicModalOpen(false);
    setSaved(false);
  };

  return (
    <div className="app-shell">
      <header className="pro-header">
        <div className="pro-header__utility">
          <div className="utility-links">
            <Span size="s" color="text/secondary">◎ Для бизнеса⌄</Span>
            <Span size="s" color="text/secondary">Карьера в Авито</Span>
            <Span size="s" color="text/secondary">Помощь</Span>
            <Span size="s" color="text/secondary">Каталоги⌄</Span>
            <Span size="s" color="text/secondary">#яПомогаю</Span>
          </div>
          <div className="utility-actions">
            <Span size="s">＋ Разместить объявление</Span>
            <Span size="s">▣ Мои объявления</Span>
            <span className="utility-icon">♥</span>
            <span className="utility-icon">●</span>
            <span className="utility-icon">●</span>
            <span className="header-avatar">АС</span>
          </div>
        </div>
        <div className="pro-header__products">
          <div className="pro-logo">
            <span className="avito-mark avito-mark--large" aria-hidden="true">
              <i />
              <i />
              <i />
              <i />
            </span>
            <span>Avito Pro</span>
          </div>
          <div className="mobile-header-actions" aria-label="Действия">
            <button type="button" aria-label="Сообщения">
              <ChatOutlineIcon size={24} ariaHidden />
              <span className="mobile-notification-dot" />
            </button>
            <button type="button" aria-label="Профиль">
              <span className="header-avatar">АС</span>
            </button>
          </div>
          <nav className="product-nav" aria-label="Разделы Авито">
            <span>Бизнес360</span>
            <span>Авто</span>
            <span>Недвижимость</span>
            <span>Работа</span>
            <span>Услуги</span>
            <span>Ещё</span>
          </nav>
        </div>
      </header>

      <div className="cabinet-layout">
        <aside className="sidebar" aria-label="Навигация кабинета">
        <div className="seller-card">
          <span className="profile-avatar profile-avatar--large">АС</span>
          <div>
            <H3 spaceBottom="4">Алексей Строй</H3>
            <P size="s"><strong>0</strong> <span className="rating-star">★</span> нет отзывов</P>
          </div>
        </div>
        <div className="wallet-card">
          <div>
            <P size="xs" color="text/secondary">Кошелёк</P>
            <H3 spaceBottom="4">0,00 ₽</H3>
            <P size="xs">Нет бонусов</P>
          </div>
          <Button preset="secondary" size="s">Пополнить</Button>
        </div>

        <nav className="sidebar__nav">
          <button className="sidebar__item" type="button">
            <ServicesIcon size={22} ariaHidden />
            <Span size="s">Мои объявления</Span>
          </button>
          <button className="sidebar__item" type="button">
            <ChatOutlineIcon size={22} ariaHidden />
            <Span size="s">Сообщения</Span>
            <span className="sidebar__badge sidebar__badge--danger">1</span>
          </button>
          <button className="sidebar__item sidebar__item--active" type="button" aria-current="page">
            <AssistantChatsIcon size={22} ariaHidden />
            <Span size="s">AI-агент</Span>
          </button>
          <div className="sidebar__spacer" />
          <button className="sidebar__item" type="button">
            <HomeIcon size={22} ariaHidden />
            <Span size="s">Настройки услуг</Span>
          </button>
          <button className="sidebar__item" type="button">
            <ServicesIcon size={22} ariaHidden />
            <Span size="s">Пакеты контактов</Span>
          </button>
          <button className="sidebar__item" type="button">
            <WalletIcon size={22} ariaHidden />
            <Span size="s">Аналитика</Span>
            <span className="sidebar__chevron">›</span>
          </button>
          <button className="sidebar__item" type="button">
            <AssistantChatsIcon size={22} ariaHidden />
            <Span size="s">Продвижение</Span>
            <span className="sidebar__chevron">›</span>
          </button>
          <button className="sidebar__item" type="button">
            <WalletIcon size={22} ariaHidden />
            <Span size="s">Тариф</Span>
          </button>
          <button className="sidebar__item" type="button">
            <WalletIcon size={22} ariaHidden />
            <Span size="s">Финансы и отчёты</Span>
            <span className="sidebar__chevron">›</span>
          </button>
          <button className="sidebar__item" type="button">
            <SettingsOutlineIcon size={22} ariaHidden />
            <Span size="s">Профиль и настройки</Span>
            <span className="sidebar__chevron">›</span>
          </button>
        </nav>
      </aside>

      <div className="workspace">
        <main className="page">
        <div className="page-heading">
          <div>
            <H1 spaceBottom="8">Настройка агента</H1>
            <P color="text/secondary">Агент отвечает клиентам по вашим объявлениям об услугах</P>
          </div>
          <div className="status">
            <span className="status-dot" />
            <Span size="s">Агент включён</Span>
          </div>
        </div>

        <TabGroup
          selectedTabId={screen}
          onChange={({ value }: { value: string }) => setScreen(value as Screen)}
          size="m"
        >
          <TabGroup.Item id="answers" name="Ответы клиентам" />
          <TabGroup.Item id="handoff" name="Передача мне" />

          <TabGroup.Panel id="answers">
            <section className="content-section">
              <div className="section-heading">
                <H1 spaceBottom="8">На какие вопросы отвечает агент</H1>
                <P color="text/secondary">
                  Выберите темы, по которым агент сможет консультировать клиентов от вашего имени
                </P>
              </div>
              <div className="section-heading section-heading--row topics-heading">
                <div>
                  <H2 spaceBottom="8">Базовый набор тем</H2>
                  <P color="text/secondary">Готовые темы, которые подходят большинству исполнителей услуг</P>
                </div>
                <Span size="s" color="text/secondary">
                  {enabledTopics.length} из {initialTopics.length} включено
                </Span>
              </div>

              <div className="topic-answer-list">
                {initialTopics.map((topic) => {
                  const checked = enabledTopics.includes(topic.id);
                  return (
                    <div className="topic-answer-pair" key={topic.id}>
                      <div className="topic-row topic-row--standalone">
                          <Switcher
                            checked={checked}
                            onChange={() => toggleTopic(topic.id)}
                            aria-label={`Включить тему ${topic.title}`}
                          />
                          <div className="topic-copy">
                            <H3 spaceBottom="4">{topic.title}</H3>
                            <P size="s" color="text/secondary">{topic.description}</P>
                          </div>
                          <div className="topic-sources">
                            <Span size="xs" color="text/secondary">Источник данных</Span>
                            <div className="source-chips">
                              {topic.sources.map((source) => (
                                <span className="source-chip" key={source}>{source}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      <aside className="topic-answer-card">
                        <div className="topic-answer-card__heading">
                          <div>
                            <H3 spaceBottom="4">Как агент отвечает</H3>
                            <P size="xs" color="text/secondary">{topic.title}</P>
                          </div>
                          <Button
                            preset="secondary"
                            size="s"
                            onClick={() => {
                              setActiveAnswerTopicId(topic.id);
                              setAnswerDraft(topicAnswers[topic.id]);
                            }}
                          >
                            Редактировать
                          </Button>
                        </div>
                        <div className="message message--agent topic-answer-card__message">
                          <P size="s">{topicAnswers[topic.id]}</P>
                        </div>
                      </aside>
                    </div>
                  );
                })}
              </div>

              <div className="custom-topics">
                <div className="custom-topics__heading">
                      <div>
                        <H2 spaceBottom="8">Расширенный набор тем</H2>
                        <P color="text/secondary">
                          Добавьте вопросы, которые важны именно для вашей услуги
                        </P>
                      </div>
                      <Button
                        preset="secondary"
                        size="m"
                        onClick={() => setTopicModalOpen(true)}
                      >
                        Выбрать тему
                      </Button>
                    </div>

                    {customTopics.length === 0 ? (
                      <div className="empty-state">
                        <P size="s" color="text/secondary">
                          Дополнительных тем пока нет
                        </P>
                      </div>
                    ) : (
                      <div className="topic-list custom-topic-list">
                        {customTopics.map((topic) => (
                          <div className="topic-row" key={topic.id}>
                            <Switcher
                              checked={topic.enabled}
                              onChange={() => {
                                setCustomTopics((current) =>
                                  current.map((item) =>
                                    item.id === topic.id ? { ...item, enabled: !item.enabled } : item,
                                  ),
                                );
                                setSaved(false);
                              }}
                              aria-label={`Включить тему ${topic.title}`}
                            />
                            <div className="topic-copy">
                              <H3 spaceBottom="4">{topic.title}</H3>
                              <P size="s" color="text/secondary">Добавлено вручную</P>
                            </div>
                            <div className="topic-sources">
                              <Span size="xs" color="text/secondary">Источник данных</Span>
                              <span className="source-chip">{topic.source}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
              </div>
            </section>
          </TabGroup.Panel>

          <TabGroup.Panel id="handoff">
            <section className="content-section">
              <div className="section-heading">
                <H1 spaceBottom="8">Когда агент передаёт диалог вам</H1>
                <P color="text/secondary">
                  Выберите ситуации, в которых агент остановит ответы и позовёт вас в чат
                </P>
              </div>
              <div className="handoff-grid">
                <div className="handoff-list">
                  {handoffConditions.map((condition) => (
                    <div className="handoff-row" key={condition.id}>
                      <div className="handoff-copy">
                        <H3 spaceBottom="4">{condition.title}</H3>
                        <P size="s" color="text/secondary">{condition.description}</P>
                      </div>
                      <Switcher
                        checked={condition.enabled}
                        onChange={() => {
                          setHandoffConditions((current) =>
                            current.map((item) =>
                              item.id === condition.id
                                ? { ...item, enabled: !item.enabled }
                                : item,
                            ),
                          );
                          setSaved(false);
                        }}
                        aria-label={condition.title}
                      />
                    </div>
                  ))}
                </div>
                <div className="handoff-preview">
                  <div className="preview-heading">
                    <div>
                      <H3 spaceBottom="4">Что увидит клиент</H3>
                      <P size="s" color="text/secondary">Сообщение перед передачей диалога</P>
                    </div>
                    <Button
                      preset="secondary"
                      size="s"
                      onClick={() => {
                        setHandoffDraft(handoffMessage);
                        setHandoffModalOpen(true);
                      }}
                    >
                      Редактировать
                    </Button>
                  </div>
                  <div className="chat-preview">
                    <div className="message message--buyer">
                      <P size="s">Можно записаться на субботу и получить скидку?</P>
                    </div>
                    <div className="message message--agent">
                      <P size="s">{handoffMessage}</P>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </TabGroup.Panel>
        </TabGroup>

        <footer className="footer-actions">
          <P size="s" color="text/secondary">
            {saved ? 'Настройки сохранены' : 'Изменения сохранятся после подтверждения'}
          </P>
          <Button onClick={handleSave} preset="primary" size="m">Сохранить настройки</Button>
        </footer>
        </main>
      </div>
      </div>

      <nav className="mobile-bottom-nav" aria-label="Мобильная навигация">
        <button type="button">
          <HomeIcon size={22} ariaHidden />
          <span>Главная</span>
        </button>
        <button type="button">
          <ServicesIcon size={22} ariaHidden />
          <span>Услуги</span>
        </button>
        <button className="mobile-bottom-nav__active" type="button" aria-current="page">
          <AssistantChatsIcon size={22} ariaHidden />
          <span>AI-агент</span>
        </button>
        <button type="button">
          <ChatOutlineIcon size={22} ariaHidden />
          <span>Чаты</span>
        </button>
        <button type="button">
          <SettingsOutlineIcon size={22} ariaHidden />
          <span>Профиль</span>
        </button>
      </nav>

      <Modal
        open={topicModalOpen}
        size="m"
        onClose={() => setTopicModalOpen(false)}
        closeOnOverlayClick
      >
        <Modal.Header title="Добавить тему" />
        <Modal.Content>
          <div className="modal-form">
            <label className="field">
              <Span size="s">Тема вопроса</Span>
              <Input
                value={draftTitle}
                onChange={({ value }: { value: string }) => setDraftTitle(value)}
                placeholder="Например, район выезда"
                clearable
              />
              <Span size="xs" color="text/secondary">
                Сформулируйте, о чём клиент может спросить агента
              </Span>
            </label>
            <label className="field">
              <Span size="s">Источник данных</Span>
              <Input
                value={draftSource}
                onChange={({ value }: { value: string }) => setDraftSource(value)}
                placeholder="Например, описание услуги или мой прайс-лист"
                clearable
              />
              <Span size="xs" color="text/secondary">
                Укажите, откуда агент должен брать подтверждённый ответ
              </Span>
            </label>
            <div className="modal-switch">
              <div>
                <P>Включить тему сразу</P>
                <P size="s" color="text/secondary">
                  Если выключить, тема сохранится как черновик
                </P>
              </div>
              <Switcher
                checked={draftEnabled}
                onChange={() => setDraftEnabled((value) => !value)}
                aria-label="Включить новую тему сразу"
              />
            </div>
          </div>
        </Modal.Content>
        <Modal.Footer>
          <div className="modal-actions">
            <Button preset="secondary" onClick={() => setTopicModalOpen(false)}>
              Отмена
            </Button>
            <Button
              preset="primary"
              disabled={!draftTitle.trim() || !draftSource.trim()}
              onClick={addCustomTopic}
            >
              Добавить тему
            </Button>
          </div>
        </Modal.Footer>
      </Modal>

      <Modal
        open={activeAnswerTopicId !== null}
        size="m"
        onClose={() => setActiveAnswerTopicId(null)}
        closeOnOverlayClick
      >
        <Modal.Header
          title={`Ответ: ${
            initialTopics.find((topic) => topic.id === activeAnswerTopicId)?.title ?? ''
          }`}
        />
        <Modal.Content>
          <div className="modal-form">
            <label className="field">
              <Span size="s">Текст ответа</Span>
              <textarea
                className="message-editor"
                value={answerDraft}
                maxLength={500}
                onChange={(event) => setAnswerDraft(event.target.value)}
                aria-label="Текст ответа агента"
              />
              <div className="field-meta">
                <Span size="xs" color="text/secondary">
                  Напишите готовый ответ или основу, которую агент дополнит данными из источников
                </Span>
                <Span size="xs" color="text/secondary">{answerDraft.length} / 500</Span>
              </div>
            </label>
            <div className="message-preview">
              <Span size="xs" color="text/secondary">Предпросмотр</Span>
              <div className="message message--agent">
                <P size="s">{answerDraft || 'Введите текст ответа'}</P>
              </div>
            </div>
          </div>
        </Modal.Content>
        <Modal.Footer>
          <div className="modal-actions">
            <Button preset="secondary" onClick={() => setActiveAnswerTopicId(null)}>
              Отмена
            </Button>
            <Button
              preset="primary"
              disabled={!answerDraft.trim()}
              onClick={() => {
                if (activeAnswerTopicId) {
                  setTopicAnswers((current) => ({
                    ...current,
                    [activeAnswerTopicId]: answerDraft.trim(),
                  }));
                }
                setActiveAnswerTopicId(null);
                setSaved(false);
              }}
            >
              Сохранить ответ
            </Button>
          </div>
        </Modal.Footer>
      </Modal>

      <Modal
        open={handoffModalOpen}
        size="m"
        onClose={() => setHandoffModalOpen(false)}
        closeOnOverlayClick
      >
        <Modal.Header title="Сообщение клиенту" />
        <Modal.Content>
          <div className="modal-form">
            <label className="field">
              <Span size="s">Текст сообщения</Span>
              <textarea
                className="message-editor"
                value={handoffDraft}
                maxLength={300}
                onChange={(event) => setHandoffDraft(event.target.value)}
                aria-label="Текст сообщения клиенту"
              />
              <div className="field-meta">
                <Span size="xs" color="text/secondary">
                  Клиент увидит этот текст перед тем, как вы подключитесь
                </Span>
                <Span size="xs" color="text/secondary">{handoffDraft.length} / 300</Span>
              </div>
            </label>
            <div className="message-preview">
              <Span size="xs" color="text/secondary">Предпросмотр</Span>
              <div className="message message--agent">
                <P size="s">{handoffDraft || 'Введите сообщение'}</P>
              </div>
            </div>
          </div>
        </Modal.Content>
        <Modal.Footer>
          <div className="modal-actions">
            <Button preset="secondary" onClick={() => setHandoffModalOpen(false)}>
              Отмена
            </Button>
            <Button
              preset="primary"
              disabled={!handoffDraft.trim()}
              onClick={() => {
                setHandoffMessage(handoffDraft.trim());
                setHandoffModalOpen(false);
                setSaved(false);
              }}
            >
              Сохранить текст
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
