import React, { useState } from 'react';
import "./Right.less";

const tabs = [
  {
    label: '原子',
    content: (<div>1</div>)
  },
  {
    label: '基团',
    content: (<div>2</div>)
  },
]

function RightArea() {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabClick = (index) => {
    setActiveTab(index);
  };

  return (
    <div className="right-wrap">
      <div className="tab-container">
        <div className="tab-buttons">
          {tabs.map((tab, index) => (
            <span
              key={index}
              className={index === activeTab ? "active" : ""}
              onClick={() => handleTabClick(index)}
            >
              {tab.label}
            </span>
          ))}
        </div>
        <div className="tab-content">{tabs[activeTab].content}</div>
      </div>
      <div>
        <span>化学键</span>
      </div>
      <div>
        <span>功能</span>
      </div>
      <div>
        <span>显示</span>
      </div>
    </div>
  );
}

export default RightArea;
