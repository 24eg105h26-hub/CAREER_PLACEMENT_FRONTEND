import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  X,
  Sparkles,
  RefreshCw,
  Plus,
  History,
  Trash2,
  Copy,
  Check,
  ExternalLink,
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import Button from './Button';
import api from '../services/api';

// Code block with Copy button
const CodeBlock = ({ language, code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div
      style={{
        margin: '10px 0',
        borderRadius: '8px',
        overflow: 'hidden',
        border: '1px solid var(--border-color)',
        background: '#1e1e2e',
        color: '#cdd6f4',
        fontSize: '12.5px',
        fontFamily: 'Consolas, Monaco, "Courier New", monospace',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '6px 12px',
          background: 'rgba(0, 0, 0, 0.35)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          fontSize: '11px',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          color: '#a6adc8',
        }}
      >
        <span>{language || 'code'}</span>
        <button
          onClick={handleCopy}
          type="button"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: 'transparent',
            border: 'none',
            color: copied ? '#a6e3a1' : '#cdd6f4',
            cursor: 'pointer',
            padding: '2px 6px',
            borderRadius: '4px',
            fontSize: '11px',
          }}
          title="Copy code"
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
          <span>{copied ? 'Copied!' : 'Copy'}</span>
        </button>
      </div>
      <pre
        style={{
          margin: 0,
          padding: '12px',
          overflowX: 'auto',
          lineHeight: '1.55',
          fontFamily: 'inherit',
          color: 'inherit',
        }}
      >
        <code>{code}</code>
      </pre>
    </div>
  );
};

// Safe markdown renderer for assistant responses
const FormattedMessage = ({ text, sources }) => {
  if (!text) return null;

  // Normalize newlines and sanitize comments
  const cleanText = text
    .replace(/\r/g, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .trim();

  // Split into code block chunks and text chunks
  const segments = [];
  const codeBlockRegex = /```([a-zA-Z0-9_-]*)\n?([\s\S]*?)```/g;
  let lastIndex = 0;
  let match;

  while ((match = codeBlockRegex.exec(cleanText)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: 'text', content: cleanText.substring(lastIndex, match.index) });
    }
    segments.push({ type: 'code', language: match[1], content: match[2].trimEnd() });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < cleanText.length) {
    segments.push({ type: 'text', content: cleanText.substring(lastIndex) });
  }

  const renderInline = (str) => {
    const parts = [];
    let remaining = str;
    let k = 0;

    while (remaining) {
      const boldMatch = remaining.match(/^(.*?)\*\*(.+?)\*\*(.*)/s);
      const codeMatch = remaining.match(/^(.*?)`([^`]+?)`(.*)/s);

      if (boldMatch && (!codeMatch || boldMatch[1].length <= codeMatch[1].length)) {
        if (boldMatch[1]) parts.push(<span key={k++}>{boldMatch[1]}</span>);
        parts.push(
          <strong key={k++} style={{ fontWeight: 650, color: 'var(--text-main)' }}>
            {boldMatch[2]}
          </strong>
        );
        remaining = boldMatch[3];
      } else if (codeMatch) {
        if (codeMatch[1]) parts.push(<span key={k++}>{codeMatch[1]}</span>);
        parts.push(
          <code
            key={k++}
            style={{
              background: 'var(--bg-surface-hover)',
              padding: '2px 5px',
              borderRadius: '4px',
              fontSize: '12px',
              border: '1px solid var(--border-color)',
              color: 'var(--primary)',
              fontFamily: 'monospace',
            }}
          >
            {codeMatch[2]}
          </code>
        );
        remaining = codeMatch[3];
      } else {
        parts.push(<span key={k++}>{remaining}</span>);
        break;
      }
    }
    return parts;
  };

  const renderTextSegment = (txt, segIdx) => {
    const rawLines = txt.split('\n');
    const lines = rawLines.filter((l) => {
      const t = l.trim();
      return !t.startsWith('//') && !t.startsWith('/*') && !t.endsWith('*/');
    });

    return (
      <div key={segIdx} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {lines.map((line, i) => {
          const trimmed = line.trim();
          if (!trimmed) return <div key={i} style={{ height: '4px' }} />;

          if (trimmed.startsWith('#')) {
            const headingText = trimmed.replace(/^#+\s*/, '');
            return (
              <h4
                key={i}
                style={{
                  margin: '8px 0 2px 0',
                  fontSize: '14.5px',
                  fontWeight: 700,
                  color: 'var(--primary)',
                }}
              >
                {headingText}
              </h4>
            );
          }

          const isBullet = trimmed.startsWith('•') || trimmed.startsWith('- ') || trimmed.startsWith('* ');
          if (isBullet) {
            const bulletContent = trimmed.replace(/^[•\-\*]\s*/, '');
            return (
              <div key={i} style={{ display: 'flex', gap: '8px', paddingLeft: '4px', alignItems: 'flex-start' }}>
                <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>•</span>
                <div style={{ flex: 1 }}>{renderInline(bulletContent)}</div>
              </div>
            );
          }

          const numMatch = trimmed.match(/^(\d+[\.\)])\s*(.*)/);
          if (numMatch) {
            return (
              <div key={i} style={{ display: 'flex', gap: '8px', paddingLeft: '4px', alignItems: 'flex-start' }}>
                <span style={{ color: 'var(--primary)', fontWeight: 600, minWidth: '18px' }}>
                  {numMatch[1]}
                </span>
                <div style={{ flex: 1 }}>{renderInline(numMatch[2])}</div>
              </div>
            );
          }

          return (
            <p key={i} style={{ margin: 0 }}>
              {renderInline(trimmed)}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13.5px', lineHeight: '1.65' }}>
      {segments.map((seg, idx) =>
        seg.type === 'code' ? (
          <CodeBlock key={idx} language={seg.language} code={seg.content} />
        ) : (
          renderTextSegment(seg.content, idx)
        )
      )}

      {/* Grounding Source links */}
      {sources && Array.isArray(sources) && sources.length > 0 && (
        <div
          style={{
            marginTop: '8px',
            paddingTop: '8px',
            borderTop: '1px dashed var(--border-color)',
            fontSize: '11.5px',
            color: 'var(--text-muted)',
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: '4px', color: 'var(--text-main)' }}>Sources:</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            {sources.map((src, sIdx) => {
              const urlMatch = src.match(/https?:\/\/[^\s\)]+/);
              const url = urlMatch ? urlMatch[0] : (src.startsWith('http') ? src : null);
              const label = urlMatch ? src.replace(urlMatch[0], '').replace(/[\(\)]/g, '').trim() || url : src;
              return (
                <div key={sIdx} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <ExternalLink size={11} />
                  {url ? (
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: 'var(--primary)', textDecoration: 'underline' }}
                    >
                      {label || url}
                    </a>
                  ) : (
                    <span>{src}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export const AIAssistant = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    {
      role: 'model',
      text: 'Hello! I am your AI Study Buddy and college mentor. Ask me anything: academics, coding, maths, career & placements, life advice, or casual chat!',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [lastFailedMessage, setLastFailedMessage] = useState(null);

  const starterChips = [
    'Explain recursion simply',
    "I'm feeling stressed about exams",
    'What is a good weekend project?',
    'Which skills should I learn for a backend job given my profile?',
    'Write a Java method to reverse a linked list',
  ];

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      loadConversations();
    }
  }, [messages, isOpen]);

  const loadConversations = async () => {
    try {
      const res = await api.get('/ai/chat/conversations');
      const list = res?.data || res?.conversations || [];
      setConversations(Array.isArray(list) ? list : []);
    } catch {
      // ignore
    }
  };

  const handleSelectConversation = async (id) => {
    try {
      setLoading(true);
      const res = await api.get(`/ai/chat/${id}`);
      const data = res?.data || res;
      setConversationId(data.id);
      if (data.messages && Array.isArray(data.messages)) {
        setMessages(
          data.messages.map((m) => ({
            role: m.role,
            text: m.content,
            sources: m.sources,
          }))
        );
      }
      setShowHistory(false);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConversation = async (e, id) => {
    e.stopPropagation();
    try {
      await api.delete(`/ai/chat/${id}`);
      setConversations((prev) => prev.filter((c) => c.id !== id));
      if (conversationId === id) {
        handleNewChat();
      }
    } catch {
      // ignore
    }
  };

  const handleNewChat = () => {
    setConversationId(null);
    setLastFailedMessage(null);
    setMessages([
      {
        role: 'model',
        text: 'Hello! I am your AI Study Buddy and college mentor. Ask me anything: academics, coding, maths, career & placements, life advice, or casual chat!',
      },
    ]);
    setShowHistory(false);
    setInput('');
  };

  const handleSend = async (overrideMessage) => {
    const messageToSend = (overrideMessage || input).trim();
    if (!messageToSend || loading) return;

    const userMsg = { role: 'user', text: messageToSend };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);
    setLastFailedMessage(null);

    try {
      const res = await api.post('/ai/chat', {
        conversationId: conversationId,
        message: messageToSend,
      });

      const data = res?.data || res;
      const reply = data?.reply || data?.answer || (typeof data === 'string' ? data : 'I am here to help!');
      const returnedConvId = data?.conversationId;
      const sources = data?.sources || [];

      if (returnedConvId) {
        setConversationId(returnedConvId);
        loadConversations();
      }

      setMessages([...updatedMessages, { role: 'model', text: reply, sources }]);
    } catch (err) {
      setLastFailedMessage(messageToSend);
      const errorMsg =
        err?.response?.data?.message ||
        'The AI buddy is unavailable right now, please try again.';
      setMessages([
        ...updatedMessages,
        {
          role: 'model',
          text: errorMsg,
          isError: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChipClick = (chipText) => {
    setInput(chipText);
    textareaRef.current?.focus();
  };

  if (!isOpen) return null;

  return (
    <div
      className="ai-drawer"
      style={{
        zIndex: 1050,
        width: '420px',
        maxWidth: '100vw',
      }}
    >
      {/* Header */}
      <div
        className="ai-header"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={18} color="var(--primary)" />
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 700, margin: 0 }}>AI Study Buddy</h3>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Gemini-Powered Mentor</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Button
            variant="ghost"
            className="btn-icon"
            onClick={handleNewChat}
            title="Start new conversation"
            aria-label="New chat"
            style={{ padding: '6px' }}
          >
            <Plus size={16} />
          </Button>

          <Button
            variant="ghost"
            className="btn-icon"
            onClick={() => setShowHistory(!showHistory)}
            title="Conversation history"
            aria-label="Chat history"
            style={{
              padding: '6px',
              color: showHistory ? 'var(--primary)' : 'inherit',
            }}
          >
            <History size={16} />
          </Button>

          <Button
            variant="ghost"
            className="btn-icon"
            onClick={onClose}
            aria-label="Close Study Buddy"
            style={{ padding: '6px' }}
          >
            <X size={16} />
          </Button>
        </div>
      </div>

      {/* History Sidebar Dropdown Panel */}
      {showHistory && (
        <div
          style={{
            background: 'var(--bg-surface-hover)',
            borderBottom: '1px solid var(--border-color)',
            maxHeight: '220px',
            overflowY: 'auto',
            padding: '8px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '4px 8px',
              fontSize: '11.5px',
              fontWeight: 600,
              color: 'var(--text-muted)',
            }}
          >
            <span>PAST CONVERSATIONS ({conversations.length})</span>
            <button
              onClick={handleNewChat}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--primary)',
                fontSize: '11.5px',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              + New
            </button>
          </div>

          {conversations.length === 0 ? (
            <div style={{ padding: '12px', textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)' }}>
              No previous chats found.
            </div>
          ) : (
            conversations.map((c) => (
              <div
                key={c.id}
                onClick={() => handleSelectConversation(c.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '7px 10px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '12.5px',
                  background: conversationId === c.id ? 'var(--bg-surface)' : 'transparent',
                  border: conversationId === c.id ? '1px solid var(--border-color)' : '1px solid transparent',
                  marginBottom: '3px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                  <MessageSquare size={13} style={{ flexShrink: 0, color: 'var(--primary)' }} />
                  <span
                    style={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: '280px',
                    }}
                  >
                    {c.title}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={(e) => handleDeleteConversation(e, c.id)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: '2px 4px',
                  }}
                  title="Delete chat"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* Messages Body */}
      <div
        className="ai-body"
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
        }}
      >
        {messages.map((m, idx) => {
          const isUser = m.role === 'user';
          return (
            <div
              key={idx}
              className={`ai-chat-bubble ${isUser ? 'ai-chat-bubble-user' : 'ai-chat-bubble-ai'}`}
              style={{
                maxWidth: '90%',
                alignSelf: isUser ? 'flex-end' : 'flex-start',
                border: m.isError ? '1px solid #ef4444' : undefined,
                backgroundColor: m.isError ? 'rgba(239, 68, 68, 0.08)' : undefined,
              }}
            >
              {isUser ? (
                <span style={{ whiteSpace: 'pre-wrap' }}>{m.text}</span>
              ) : (
                <>
                  {m.isError && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ef4444', marginBottom: '6px' }}>
                      <AlertCircle size={14} />
                      <strong style={{ fontSize: '12px' }}>Service Notice</strong>
                    </div>
                  )}
                  <FormattedMessage text={m.text} sources={m.sources} />
                  {m.isError && lastFailedMessage && (
                    <div style={{ marginTop: '8px' }}>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleSend(lastFailedMessage)}
                        style={{ fontSize: '11px', padding: '4px 10px' }}
                      >
                        <RefreshCw size={11} style={{ marginRight: '4px' }} /> Retry question
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}

        {loading && (
          <div
            className="ai-chat-bubble ai-chat-bubble-ai"
            style={{
              alignSelf: 'flex-start',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <RefreshCw size={13} className="spin" style={{ color: 'var(--primary)' }} />
            <span style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
              Study Buddy is thinking...
            </span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Starter Chips (Only fill the input, never bypass API) */}
      <div
        style={{
          padding: '8px 14px 4px 14px',
          display: 'flex',
          gap: '6px',
          flexWrap: 'wrap',
          borderTop: '1px solid var(--border-color)',
          background: 'var(--bg-surface)',
        }}
      >
        <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', width: '100%', marginBottom: '2px' }}>
          Suggested topics:
        </span>
        {starterChips.map((chip, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleChipClick(chip)}
            style={{
              fontSize: '11.5px',
              padding: '4px 9px',
              borderRadius: '12px',
              background: 'var(--bg-surface-hover)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseOver={(e) => (e.currentTarget.style.borderColor = 'var(--primary)')}
            onMouseOut={(e) => (e.currentTarget.style.borderColor = 'var(--border-color)')}
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Input Area */}
      <div
        className="ai-footer"
        style={{
          padding: '10px 14px 6px 14px',
          flexDirection: 'column',
          gap: '6px',
        }}
      >
        <div style={{ display: 'flex', gap: '8px', width: '100%', alignItems: 'flex-end' }}>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything (academics, coding, maths, career, chat)..."
            rows={2}
            style={{
              flex: 1,
              padding: '8px 10px',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-surface-hover)',
              color: 'var(--text-main)',
              fontSize: '13px',
              fontFamily: 'inherit',
              resize: 'none',
              outline: 'none',
            }}
            onFocus={(e) => (e.target.style.borderColor = 'var(--primary)')}
            onBlur={(e) => (e.target.style.borderColor = 'var(--border-color)')}
          />
          <Button
            variant="primary"
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
            style={{
              padding: '10px 14px',
              height: '42px',
              borderRadius: '8px',
            }}
            title="Send (Enter)"
            aria-label="Send message"
          >
            <Send size={15} />
          </Button>
        </div>

        <div
          style={{
            fontSize: '10.5px',
            color: 'var(--text-muted)',
            textAlign: 'center',
            paddingBottom: '4px',
          }}
        >
          AI-generated, may contain mistakes. Shift+Enter for new line.
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
