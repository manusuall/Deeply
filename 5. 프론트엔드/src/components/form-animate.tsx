'use client'

import React, { useState, ChangeEvent } from 'react';
import { Input } from "./ui/input";
import { motion } from "framer-motion";

const FormAnimate: React.FC = () => {
  // 상태(state)로 입력값을 관리합니다.
  const [query, setPlaylistUrl] = useState<string>('');

  // 입력값이 변경될 때 호출되는 함수입니다.
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
      setPlaylistUrl(event.target.value);
  };

  return (
      <motion.form className="flex gap-4" action={'playlist2/' + query} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          <Input 
              placeholder="당신의 플레이리스트를 입력해보세요." 
              className="py-8 bg-primary-foreground px-4 text-3xl"
              value={query}  // Input의 value 속성에 상태를 연결합니다.
              onChange={handleInputChange}  // 입력값 변경 이벤트를 처리합니다.
          />
      </motion.form>
  );
}

export default FormAnimate;


