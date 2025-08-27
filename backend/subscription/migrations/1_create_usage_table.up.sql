CREATE TABLE user_usage (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  image_processing INTEGER NOT NULL DEFAULT 0,
  video_processing INTEGER NOT NULL DEFAULT 0,
  card_generation INTEGER NOT NULL DEFAULT 0,
  reset_date TIMESTAMP NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, reset_date)
);

CREATE INDEX idx_user_usage_user_id ON user_usage(user_id);
CREATE INDEX idx_user_usage_reset_date ON user_usage(reset_date);
