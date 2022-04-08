import React from 'react';
import Style from './add.modules.scss';

/**
 * @file 交互
 */

const AddOperator: React.FC = () => {
  return (
    <div className={Style.overlay}>
      <img src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTggMS4zMzMyNVYxNC42NjY2IiBzdHJva2U9IiMzMzMzMzMiIHN0cm9rZS13aWR0aD0iMS4zMzMzIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPHBhdGggZD0iTTE0LjY2NjcgOEwxLjMzMzQyIDgiIHN0cm9rZT0iIzMzMzMzMyIgc3Ryb2tlLXdpZHRoPSIxLjMzMzMiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8L3N2Zz4K' />
    </div>
  );
};

export default AddOperator;