-- Advanced Stock Market Analysis SQL Script

-- Create Stock Data Table
CREATE TABLE stock_data (
    date DATE PRIMARY KEY,
    open DECIMAL(10,2),
    close DECIMAL(10,2),
    high DECIMAL(10,2),
    low DECIMAL(10,2),
    volume BIGINT,
    market_cap DECIMAL(15,2)
);

-- Performance Analysis View
CREATE VIEW stock_performance_analysis AS
WITH daily_metrics AS (
    SELECT 
        date,
        close,
        volume,
        market_cap,
        (close - LAG(close) OVER (ORDER BY date)) / LAG(close) OVER (ORDER BY date) * 100 AS daily_return_pct,
        AVG(close) OVER (PARTITION BY EXTRACT(YEAR FROM date)) AS yearly_avg_price
    FROM stock_data
),
volatility_metrics AS (
    SELECT 
        EXTRACT(YEAR FROM date) AS year,
        STDDEV(daily_return_pct) AS annual_volatility,
        MIN(close) AS yearly_low,
        MAX(close) AS yearly_high,
        AVG(volume) AS avg_daily_volume
    FROM daily_metrics
    GROUP BY EXTRACT(YEAR FROM date)
),
trend_analysis AS (
    SELECT 
        date,
        close,
        AVG(close) OVER (ORDER BY date ROWS BETWEEN 50 PRECEDING AND CURRENT ROW) AS moving_avg_50d,
        AVG(close) OVER (ORDER BY date ROWS BETWEEN 200 PRECEDING AND CURRENT ROW) AS moving_avg_200d
    FROM stock_data
)

SELECT 
    v.year,
    v.annual_volatility,
    v.yearly_low,
    v.yearly_high,
    v.avg_daily_volume,
    t.moving_avg_50d,
    t.moving_avg_200d,
    (t.close - t.moving_avg_50d) / t.moving_avg_50d * 100 AS price_deviation_50d,
    (t.close - t.moving_avg_200d) / t.moving_avg_200d * 100 AS price_deviation_200d
FROM volatility_metrics v
JOIN trend_analysis t ON v.year = EXTRACT(YEAR FROM t.date);

-- Risk Assessment Procedure
CREATE PROCEDURE calculate_stock_risk()
BEGIN
    WITH risk_metrics AS (
        SELECT 
            STDDEV(daily_return_pct) AS volatility_risk,
            MAX(ABS(daily_return_pct)) AS max_daily_risk,
            MIN(daily_return_pct) AS worst_daily_return,
            PERCENTILE_CONT(0.05) WITHIN GROUP (ORDER BY daily_return_pct) AS var_95
        FROM daily_metrics
    )
    SELECT 
        volatility_risk,
        max_daily_risk,
        worst_daily_return,
        var_95 AS value_at_risk_95
    FROM risk_metrics;
END;

-- Trading Signal Generation
CREATE FUNCTION generate_trading_signals(lookback_period INT)
RETURNS TABLE (
    date DATE,
    close DECIMAL(10,2),
    signal VARCHAR(20)
)
BEGIN
    RETURN (
        WITH signal_calc AS (
            SELECT 
                date,
                close,
                moving_avg_50d,
                moving_avg_200d,
                CASE 
                    WHEN moving_avg_50d > moving_avg_200d THEN 'BUY'
                    WHEN moving_avg_50d < moving_avg_200d THEN 'SELL'
                    ELSE 'HOLD'
                END AS trading_signal
            FROM trend_analysis
        )
        SELECT * FROM signal_calc
    );
END;

-- Comprehensive Performance Report Stored Procedure
CREATE PROCEDURE generate_stock_performance_report(IN start_date DATE, IN end_date DATE)
BEGIN
    SELECT 
        MIN(close) AS min_price,
        MAX(close) AS max_price,
        AVG(close) AS avg_price,
        SUM(volume) AS total_volume,
        (MAX(close) - MIN(close)) / MIN(close) * 100 AS total_return_pct
    FROM stock_data
    WHERE date BETWEEN start_date AND end_date;
END;
