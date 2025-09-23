"use client";

import React from 'react';
import { useAuth } from '../../contexts/auth-context';
import styles from "./style.module.scss";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Добро пожаловать, {user?.username}!</h2>
        <p className={styles.subtitle}>Отсюда вы можете управлять своими документами.</p>
        
        <div className={styles.projectDescription}>
          <h3 className={styles.projectTitle}>Проект: Управление персональными данными</h3>
          <p className={styles.projectText}>
            Современная система для безопасного хранения и управления персональными данными. 
            Обеспечивает конфиденциальность, контроль доступа и удобное управление 
            личной информацией в соответствии с требованиями законодательства о защите данных.
          </p>
        </div>

        <div className={styles.features}>
          <div className={styles.feature}>
            <h4 className={styles.featureTitle}>Безопасность</h4>
            <p className={styles.featureText}>Шифрование данных и защита от несанкционированного доступа</p>
          </div>
          <div className={styles.feature}>
            <h4 className={styles.featureTitle}>Конфиденциальность</h4>
            <p className={styles.featureText}>Полный контроль над вашими персональными данными</p>
          </div>
          <div className={styles.feature}>
            <h4 className={styles.featureTitle}>Удобство</h4>
            <p className={styles.featureText}>Интуитивно понятный интерфейс для управления информацией</p>
          </div>
        </div>

        <div className={styles.buttonContainer}>
          <a className={styles.button} href="/documents">Перейти к документам</a>
        </div>
      </div>
    </div>
  )
}