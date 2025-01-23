import pandas as pd
import plotly.express as px
import plotly.graph_objs as go
import dash
from dash import dcc, html
from dash.dependencies import Input, Output
import numpy as np

# Load and Preprocess Data
def load_stock_data(file_path):
    df = pd.read_csv(file_path)
    df['Date'] = pd.to_datetime(df['Date'])
    
    # Calculate additional metrics
    df['Daily_Return'] = df['Close'].pct_change() * 100
    df['Volatility_30d'] = df['Close'].rolling(window=30).std()
    
    return df

# Comprehensive Stock Market Analysis
def perform_stock_analysis(df):
    analysis_results = {
        'Total_Trading_Days': len(df),
        'Average_Volume': df['Volume'].mean(),
        'Average_Close_Price': df['Close'].mean(),
        'Lowest_Price': df['Low'].min(),
        'Highest_Price': df['High'].max(),
        'Total_Return': ((df['Close'].iloc[-1] / df['Close'].iloc[0]) - 1) * 100,
        'Average_Daily_Return': df['Daily_Return'].mean(),
        'Standard_Deviation_Returns': df['Daily_Return'].std(),
        'Max_Daily_Gain': df['Daily_Return'].max(),
        'Max_Daily_Loss': df['Daily_Return'].min(),
        'Average_Market_Cap': df['Market_Cap'].mean()
    }
    
    return analysis_results

# Create Dash Dashboard
def create_stock_dashboard(df):
    app = dash.Dash(__name__)
    
    app.layout = html.Div([
        html.H1('Stock Market Analysis Dashboard'),
        
        dcc.Dropdown(
            id='chart-selector',
            options=[
                {'label': 'Close Price', 'value': 'Close'},
                {'label': 'Volume', 'value': 'Volume'},
                {'label': 'Daily Returns', 'value': 'Daily_Return'}
            ],
            value='Close',
            style={'width': '50%'}
        ),
        
        dcc.Graph(id='stock-chart'),
        
        html.Div(id='analysis-results', style={'margin-top': '20px'})
    ])
    
    @app.callback(
        [Output('stock-chart', 'figure'),
         Output('analysis-results', 'children')],
        [Input('chart-selector', 'value')]
    )
    def update_dashboard(selected_chart):
        # Chart
        if selected_chart == 'Close':
            fig = px.line(df, x='Date', y='Close', title='Stock Close Price Over Time')
        elif selected_chart == 'Volume':
            fig = px.bar(df, x='Date', y='Volume', title='Daily Trading Volume')
        else:
            fig = px.line(df, x='Date', y='Daily_Return', title='Daily Returns')
        
        # Analysis Results
        analysis = perform_stock_analysis(df)
        results_text = html.Div([
            html.H3('Key Analysis Metrics'),
            html.Table([
                html.Tr([html.Td(k), html.Td(f'{v:.2f}' if isinstance(v, float) else v)])
                for k, v in analysis.items()
            ])
        ])
        
        return fig, results_text
    
    return app

# Main Execution
if __name__ == '__main__':
    # Load data
    df = load_stock_data('stock_market_data.csv')
    
    # Run analysis and print results
    analysis_results = perform_stock_analysis(df)
    print("Stock Market Analysis Results:")
    for key, value in analysis_results.items():
        print(f"{key}: {value}")
    
    # Create and run dashboard
    app = create_stock_dashboard(df)
    app.run_server(debug=True)

# Save analysis results to CSV
def save_analysis_to_csv(analysis_results, filename='stock_analysis_results.csv'):
    pd.DataFrame.from_dict(analysis_results, orient='index', columns=['Value']).to_csv(filename)

save_analysis_to_csv(analysis_results)
