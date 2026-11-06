import './TabBar.css';

export default function TabBar({ tabs, activeTab, onTabSelect, onTabClose, onNewTab }) {
  return (
    <div className="tabbar" role="tablist">
      <div className="tabbar__tabs">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <div
              key={tab.id}
              className={`tabbar__tab ${isActive ? 'tabbar__tab--active' : ''} ${
                tab.modified ? 'tabbar__tab--modified' : ''
              }`}
              onClick={() => onTabSelect(tab.id)}
              role="tab"
              aria-selected={isActive}
              id={`tab-${tab.id}`}
            >
              {/* Notepad++ Tab Pencil Icon (Red when modified, Green/Silver when clean) */}
              <span className="tabbar__icon">
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                  {tab.modified ? (
                    /* Red pencil for unsaved/modified file */
                    <path
                      d="M12.5 1.5l2 2-9 9H3.5v-2l9-9zM1 14.5h14"
                      stroke="#f43f5e"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="#fda4af"
                    />
                  ) : (
                    /* Silver/Dark pencil for saved clean file */
                    <path
                      d="M12.5 1.5l2 2-9 9H3.5v-2l9-9zM1 14.5h14"
                      stroke="#94a3b8"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="#cbd5e1"
                    />
                  )}
                </svg>
              </span>

              <span className="tabbar__tab-title">
                {tab.name}
              </span>

              <span className="tabbar__pin" title="Fijar pestaña">📌</span>

              {tabs.length > 1 && (
                <button
                  className="tabbar__tab-close"
                  onClick={(e) => {
                    e.stopPropagation();
                    onTabClose(tab.id);
                  }}
                  title="Cerrar pestaña"
                  id={`tab-close-${tab.id}`}
                >
                  ✕
                </button>
              )}
            </div>
          );
        })}
      </div>
      <button
        className="tabbar__new"
        onClick={onNewTab}
        title="Nueva pestaña (Ctrl+T)"
        id="btn-new-tab"
      >
        +
      </button>
    </div>
  );
}
