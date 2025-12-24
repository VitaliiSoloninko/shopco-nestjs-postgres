# Refresh Token Implementation

## Описание

В проект добавлена реализация Refresh Token для улучшения безопасности аутентификации.

## Характеристики токенов

- **Access Token**: живет **15 минут**
- **Refresh Token**: живет **30 дней**

## Как это работает

### 1. Регистрация и Логин

```
POST /api/auth/register
POST /api/auth/login
```

- Возвращает `access_token` в теле ответа
- Устанавливает `refresh_token` в httpOnly cookie (защита от XSS)
- Hash refresh token сохраняется в базе данных

### 2. Обновление токенов

```
POST /api/auth/refresh
```

- Читает refresh token из httpOnly cookie
- Проверяет его валидность и соответствие с hash в БД
- Возвращает новый `access_token`
- Устанавливает новый `refresh_token` в httpOnly cookie

### 3. Выход из системы

```
POST /api/auth/logout
```

- Удаляет refresh token из БД
- Очищает httpOnly cookie

## Безопасность

1. **Refresh Token**:
   - Хранится только в httpOnly cookie (недоступен для JavaScript)
   - Hash сохраняется в БД (можно инвалидировать)
   - Короткий срок жизни access token минимизирует риск перехвата

2. **Access Token**:
   - Хранится в памяти фронтенда (localStorage/state)
   - Короткий срок жизни (15 минут)
   - Передается в заголовке Authorization

## Настройка

Добавьте в `.env`:

```env
JWT_SECRET=your_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key
```

## Использование на фронтенде

### Axios пример

```typescript
// Настройка axios для автоматической отправки cookies
axios.defaults.withCredentials = true;

// Логин
const { data } = await axios.post('/api/auth/login', credentials);
localStorage.setItem('access_token', data.access_token);

// Обновление токена при 401 ошибке
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        const { data } = await axios.post('/api/auth/refresh');
        localStorage.setItem('access_token', data.access_token);
        // Повторить запрос
        return axios(error.config);
      } catch {
        // Redirect to login
      }
    }
    return Promise.reject(error);
  },
);
```

## Новые endpoints

- `POST /api/auth/register` - регистрация (возвращает access_token + устанавливает cookie)
- `POST /api/auth/login` - вход (возвращает access_token + устанавливает cookie)
- `POST /api/auth/refresh` - обновление токенов (требует refresh token в cookie)
- `POST /api/auth/logout` - выход (очищает refresh token)

## Изменения в БД

Добавлено поле `refreshToken` в таблицу `users`:

```sql
ALTER TABLE users ADD COLUMN "refreshToken" TEXT;
```

После изменения кода необходимо перезапустить приложение, и Sequelize автоматически синхронизирует изменения с БД.
