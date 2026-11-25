import { PythonDomainTrack } from '../types';

export const PYTHON_DOMAIN_TRACKS: PythonDomainTrack[] = [
  {
    id: 'data-science',
    goalTitle: {
      en: 'Data Science & Analytics',
      hi: 'Data Science & Analytics',
      gu: 'ડેટા સાયન્સ અને એનાલિટિક્સ',
    },
    topLibrariesSummary: 'Matplotlib & Seaborn',
    primaryPurpose: {
      en: 'Creating charts, graphs, and statistical visualizations.',
      hi: 'Charts, graphs aur statistical data visualizations banana.',
      gu: 'ચાર્ટ્સ, ગ્રાફ અને સ્ટેટિસ્ટિકલ વિઝ્યુલાઇઝેશન બનાવવું.',
    },
    careerRoles: ['Data Analyst', 'BI Analyst', 'Product Analyst'],
    libraries: [
      {
        id: 'lib-matplotlib',
        name: 'Matplotlib',
        pipInstall: 'pip install matplotlib',
        tagline: {
          en: 'The foundational plotting library for line charts, bar graphs, scatter plots, and custom figures.',
          hi: 'Python ki foundational plotting library — line charts, bar graphs aur scatter plots banane ke liye.',
          gu: 'લાઇન ચાર્ટ્સ, બાર ગ્રાફ અને સ્કેટર પ્લોટ્સ બનાવવા માટેની પાયાની પ્લોટિંગ લાઇબ્રેરી.',
        },
        whenToUse: {
          en: 'Use Matplotlib whenever you want full pixel-level control over axes, labels, titles, subplots, or exporting publication-ready PNG/PDF reports.',
          hi: 'Jab aapko chart ke title, axes, labels, colors aur subplots par poora control chahiye ya PNG report save karni ho.',
          gu: 'જ્યારે તમને ચાર્ટના ટાઇટલ, એક્સિસ, લેબલ્સ અથવા PNG રિપોર્ટ એક્સપોર્ટ પર સંપૂર્ણ કંટ્રોલ જોઈતો હોય ત્યારે વાપરો.',
        },
        indiaExample: {
          en: 'Plotting monthly UPI transaction growth (Jan–Jun) or comparing IPL team run rates across overs.',
          hi: 'Monthly UPI transaction growth plot karna ya IPL match ke har over ka run-rate graph banana.',
          gu: 'માસિક UPI ટ્રાન્ઝેક્શન ગ્રોથનો ગ્રાફ બનાવવો અથવા IPL મેચના ઓવર મુજબ રન-રેટ દર્શાવવા.',
        },
        keyApis: [
          {
            api: 'plt.plot(x, y)',
            purpose: {
              en: 'Draws a line graph connecting x and y data points.',
              hi: 'X aur Y values ko jodkar line chart banata hai.',
              gu: 'X અને Y ડેટા પોઇન્ટ્સને જોડીને લાઇન ગ્રાફ બનાવે છે.',
            },
          },
          {
            api: 'plt.bar(labels, values)',
            purpose: {
              en: 'Draws vertical bar charts to compare categories.',
              hi: 'Categories compare karne ke liye bar chart banata hai.',
              gu: 'કેટેગરીની સરખામણી કરવા માટે બાર ચાર્ટ બનાવે છે.',
            },
          },
          {
            api: 'plt.title() / plt.xlabel()',
            purpose: {
              en: 'Adds readable titles and axis labels to your graph.',
              hi: 'Graph par saaf title aur X/Y axis ke naam likhta hai.',
              gu: 'ગ્રાફ પર સ્પષ્ટ ટાઇટલ અને એક્સિસના નામ ઉમેરે છે.',
            },
          },
          {
            api: 'plt.savefig("report.png")',
            purpose: {
              en: 'Saves the generated chart as an image file for slides or reports.',
              hi: 'Chart ko PNG image mein save karta hai presentation ke liye.',
              gu: 'બનાવેલા ચાર્ટને પ્રેઝન્ટેશન માટે PNG ઇમેજ તરીકે સેવ કરે છે.',
            },
          },
        ],
        productionCode: `import matplotlib.pyplot as plt

months = ["Jan", "Feb", "Mar", "Apr"]
sales_inr = [42000, 51000, 48500, 63000]

plt.bar(months, sales_inr, color="#00F59B")
plt.title("Q1 Store Revenue (INR)")
plt.xlabel("Month")
plt.ylabel("Revenue")
plt.savefig("q1_sales.png")
print("Chart saved: q1_sales.png")`,
        expectedOutput: 'Chart saved: q1_sales.png (4-month revenue bar chart rendered)',
        lineByLine: [
          {
            line: 'import matplotlib.pyplot as plt',
            explanation: {
              en: 'Standard alias `plt` imports the plotting interface.',
              hi: 'Standard shortcut `plt` se plotting module import hota hai.',
              gu: 'સ્ટાન્ડર્ડ શોર્ટકટ `plt` થી પ્લોટિંગ મોડ્યુલ ઇમ્પોર્ટ થાય છે.',
            },
          },
          {
            line: 'plt.bar(months, sales_inr, color="#00F59B")',
            explanation: {
              en: 'Plots month names on X-axis and INR revenue heights on Y-axis.',
              hi: 'X-axis par months aur Y-axis par sales height ka bar chart banata hai.',
              gu: 'X-એક્સિસ પર મહિના અને Y-એક્સિસ પર આવકનો બાર ચાર્ટ દોરે છે.',
            },
          },
          {
            line: 'plt.savefig("q1_sales.png")',
            explanation: {
              en: 'Exports the rendered chart directly to disk as a PNG.',
              hi: 'Bana hua chart PNG file ke roop mein save kar deta hai.',
              gu: 'તૈયાર થયેલો ચાર્ટ સીધો PNG ફાઇલ તરીકે સેવ કરે છે.',
            },
          },
        ],
        sandboxPrompt: {
          en: 'Practice building a chart data summary in pure Python: print each month and an ASCII bar scaled by dividing sales by 10000.',
          hi: 'Pure Python mein chart logic practice karein: har month ke aage sales // 10000 jitne "#" bars print karein.',
          gu: 'પ્યોર Python માં ચાર્ટ લોજિક પ્રેક્ટિસ કરો: દરેક મહિના માટે sales // 10000 જેટલા "#" બાર પ્રિન્ટ કરો.',
        },
        sandboxStarterCode: `months = ["Jan", "Feb", "Mar", "Apr"]
sales = [40000, 50000, 30000, 60000]

for i in range(len(months)):
    bars = "#" * (sales[i] // 10000)
    print(months[i] + ": " + bars)`,
        sandboxExpectedOutput: `Jan: ####\nFeb: #####\nMar: ###\nApr: ######`,
        quiz: {
          id: 'quiz-lib-matplotlib',
          question: {
            en: 'Which Matplotlib function is used to save a chart as an image file?',
            hi: 'Matplotlib mein chart ko image file mein save karne ke liye kaunsa function use hota hai?',
            gu: 'Matplotlib માં ચાર્ટને ઇમેજ ફાઇલ તરીકે સેવ કરવા કયું ફંક્શન વપરાય છે?',
          },
          options: [
            { en: 'plt.export()', hi: 'plt.export()', gu: 'plt.export()' },
            { en: 'plt.savefig()', hi: 'plt.savefig()', gu: 'plt.savefig()' },
            { en: 'plt.write_img()', hi: 'plt.write_img()', gu: 'plt.write_img()' },
          ],
          correctIndex: 1,
          explanation: {
            en: '`plt.savefig("filename.png")` writes the active figure to disk.',
            hi: '`plt.savefig("filename.png")` se chart image save hota hai.',
            gu: '`plt.savefig("filename.png")` થી ચાર્ટ ઇમેજ તરીકે સેવ થાય છે.',
          },
        },
      },
      {
        id: 'lib-seaborn',
        name: 'Seaborn',
        pipInstall: 'pip install seaborn pandas',
        tagline: {
          en: 'High-level statistical visualization built on Matplotlib for heatmaps, distributions, and clean themes.',
          hi: 'Matplotlib ke upar bani modern library — heatmaps, distributions aur stylish statistical charts ke liye.',
          gu: 'Matplotlib પર આધારિત હાઇ-લેવલ લાઇબ્રેરી — હીટમેપ, ડિસ્ટ્રિબ્યુશન અને સુંદર સ્ટેટિસ્ટિકલ ચાર્ટ્સ માટે.',
        },
        whenToUse: {
          en: 'Use Seaborn when working with Pandas DataFrames and you need statistical plots (boxplots, correlation heatmaps, regression lines) in a single line of code.',
          hi: 'Jab aap Pandas DataFrame par kaam kar rahe hon aur 1 line mein boxplot, heatmap ya correlation chart banana ho.',
          gu: 'જ્યારે તમે Pandas DataFrame પર કામ કરતા હોવ અને 1 જ લાઇનમાં બોક્સપ્લોટ અથવા હીટમેપ બનાવવો હોય ત્યારે વાપરો.',
        },
        indiaExample: {
          en: 'Visualizing correlation between house size, location, and price in Bengaluru or Ahmedabad real estate datasets.',
          hi: 'Real estate data mein area, BHK aur price ke beech correlation heatmap dikhana.',
          gu: 'રિયલ એસ્ટેટ ડેટામાં ઘરની સાઇઝ, લોકેશન અને કિંમત વચ્ચેનો સંબંધ હીટમેપથી દર્શાવવો.',
        },
        keyApis: [
          {
            api: 'sns.heatmap(corr, annot=True)',
            purpose: {
              en: 'Displays a color-coded correlation matrix with numbers inside cells.',
              hi: 'Data columns ke beech relationship ko color grid aur numbers mein dikhata hai.',
              gu: 'ડેટા કોલમ્સ વચ્ચેના સંબંધને કલર હીટમેપ અને નંબર્સ સાથે દર્શાવે છે.',
            },
          },
          {
            api: 'sns.boxplot(x=..., y=...)',
            purpose: {
              en: 'Shows median, spread, and outliers across categories.',
              hi: 'Har group ka median aur outliers saaf dikhata hai.',
              gu: 'દરેક કેટેગરીનો મિડિયન અને આઉટલાયર્સ સરળતાથી બતાવે છે.',
            },
          },
          {
            api: 'sns.histplot(data, kde=True)',
            purpose: {
              en: 'Plots a distribution histogram with a smooth density curve.',
              hi: 'Values ka distribution histogram aur smooth curve ke saath banata hai.',
              gu: 'સ્મૂધ ડેન્સિટી કર્વ સાથે ડિસ્ટ્રિબ્યુશન હિસ્ટોગ્રામ બનાવે છે.',
            },
          },
        ],
        productionCode: `import seaborn as sns
import matplotlib.pyplot as plt

tips = sns.load_dataset("tips")
sns.set_theme(style="darkgrid")
sns.boxplot(data=tips, x="day", y="total_bill")
plt.title("Bill Distribution by Day")
plt.show()`,
        expectedOutput: 'Boxplots rendered for Thur, Fri, Sat, Sun with median and outlier markers',
        lineByLine: [
          {
            line: 'sns.set_theme(style="darkgrid")',
            explanation: {
              en: 'Applies clean grid styling automatically across all plots.',
              hi: 'Ek hi line mein chart par clean background grid style lagata hai.',
              gu: 'એક જ લાઇનમાં ચાર્ટ પર ક્લીન ગ્રીડ સ્ટાઇલ લાગુ કરે છે.',
            },
          },
          {
            line: 'sns.boxplot(data=tips, x="day", y="total_bill")',
            explanation: {
              en: 'Reads column names straight from the DataFrame and draws quartiles.',
              hi: 'DataFrame ke column names use karke har din ka bill spread plot karta hai.',
              gu: 'DataFrame ના કોલમ નામનો સીધો ઉપયોગ કરીને દરેક દિવસનું વિતરણ બતાવે છે.',
            },
          },
        ],
        sandboxPrompt: {
          en: 'Compute the min, median (middle element of sorted list), and max of a dataset — the core stats behind `sns.boxplot`.',
          hi: 'Sorted list se min, median aur max calculate karein — yahi `sns.boxplot` ke 3 main points hote hain.',
          gu: 'સોર્ટેડ લિસ્ટમાંથી min, median અને max ગણો — જે `sns.boxplot` ના મુખ્ય આંકડા છે.',
        },
        sandboxStarterCode: `bills = [240, 120, 450, 310, 180]
bills.sort()
mid = len(bills) // 2
print("Min:", bills[0], "Median:", bills[mid], "Max:", bills[-1])`,
        sandboxExpectedOutput: 'Min: 120 Median: 240 Max: 450',
        quiz: {
          id: 'quiz-lib-seaborn',
          question: {
            en: 'Which Seaborn plot is best for viewing correlations between numeric columns?',
            hi: 'Numeric columns ke beech correlation dekhne ke liye kaunsa Seaborn plot sabse best hai?',
            gu: 'ન્યુમેરિક કોલમ્સ વચ્ચેનો સંબંધ (correlation) જોવા કયો Seaborn પ્લોટ શ્રેષ્ઠ છે?',
          },
          options: [
            { en: 'sns.heatmap()', hi: 'sns.heatmap()', gu: 'sns.heatmap()' },
            { en: 'sns.pie()', hi: 'sns.pie()', gu: 'sns.pie()' },
            { en: 'sns.text()', hi: 'sns.text()', gu: 'sns.text()' },
          ],
          correctIndex: 0,
          explanation: {
            en: '`sns.heatmap(df.corr(), annot=True)` is the standard way to inspect feature correlations.',
            hi: '`sns.heatmap(df.corr(), annot=True)` feature correlations dekhne ka standard tareeka hai.',
            gu: '`sns.heatmap(df.corr(), annot=True)` ફીચર કોરિલેશન જોવા માટેની સ્ટાન્ડર્ડ રીત છે.',
          },
        },
      },
    ],
  },
  {
    id: 'ml-ai',
    goalTitle: {
      en: 'Machine Learning & AI',
      hi: 'Machine Learning & AI',
      gu: 'મશીન લર્નિંગ અને AI',
    },
    topLibrariesSummary: 'Scikit-learn, PyTorch, TensorFlow',
    primaryPurpose: {
      en: 'Predictive modeling (Scikit-learn) and deep learning/neural networks (PyTorch/TensorFlow).',
      hi: 'Predictive modeling (Scikit-learn) aur deep learning / neural networks (PyTorch/TensorFlow).',
      gu: 'પ્રિડિક્ટિવ મોડેલિંગ (Scikit-learn) અને ડીપ લર્નિંગ / ન્યુરલ નેટવર્ક્સ (PyTorch/TensorFlow).',
    },
    careerRoles: ['ML Engineer', 'AI Developer', 'Applied Scientist'],
    libraries: [
      {
        id: 'lib-sklearn',
        name: 'Scikit-learn',
        pipInstall: 'pip install scikit-learn',
        tagline: {
          en: 'The #1 Python library for classical machine learning: regression, classification, clustering, and model evaluation.',
          hi: 'Classical ML ki #1 library — regression, classification, train-test split aur accuracy check karne ke liye.',
          gu: 'ક્લાસિકલ મશીન લર્નિંગ માટેની નંબર 1 લાઇબ્રેરી — રિગ્રેશન, ક્લાસિફિકેશન અને મોડેલ ટેસ્ટિંગ માટે.',
        },
        whenToUse: {
          en: 'Start with Scikit-learn for tabular/CSV prediction problems (house prices, loan approval, customer churn) before jumping to deep learning.',
          hi: 'Tabular data predictions (salary, loan approval, house price) ke liye hamesha Scikit-learn se shuru karein.',
          gu: 'ટેબ્યુલર ડેટા (મકાનની કિંમત, લોન મંજૂરી, સેલ્સ આગાહી) માટે હંમેશા Scikit-learn થી શરૂઆત કરો.',
        },
        indiaExample: {
          en: 'Predicting food delivery time from distance & traffic, or flagging fraudulent UPI transactions.',
          hi: 'Distance aur traffic se food delivery time predict karna ya suspicious transactions detect karna.',
          gu: 'અંતર અને ટ્રાફિક પરથી ફૂડ ડિલિવરી ટાઇમની આગાહી કરવી અથવા શંકાસ્પદ ટ્રાન્ઝેક્શન શોધવા.',
        },
        keyApis: [
          {
            api: 'train_test_split(X, y, test_size=0.2)',
            purpose: {
              en: 'Splits data into 80% training and 20% unseen test data.',
              hi: 'Data ko 80% training aur 20% testing hisse mein baantta hai.',
              gu: 'ડેટાને 80% ટ્રેનિંગ અને 20% ટેસ્ટિંગ ભાગમાં વહેંચે છે.',
            },
          },
          {
            api: 'model.fit(X_train, y_train)',
            purpose: {
              en: 'Trains the ML algorithm on historical examples.',
              hi: 'Model ko purane data se patterns seekhne deta hai.',
              gu: 'મોડેલને જૂના ડેટા પરથી પેટર્ન શીખવાડે છે.',
            },
          },
          {
            api: 'model.predict(X_test)',
            purpose: {
              en: 'Generates predictions for new, unseen inputs.',
              hi: 'Naye inputs par prediction output nikalta hai.',
              gu: 'નવા ઇનપુટ માટે આગાહી (prediction) આપે છે.',
            },
          },
        ],
        productionCode: `from sklearn.linear_model import LinearRegression

# Hours studied -> Exam score
X = [[1], [2], [4], [6]]
y = [35, 50, 72, 90]

model = LinearRegression()
model.fit(X, y)
predicted = model.predict([[5]])
print("Predicted score for 5 hrs:", round(predicted[0], 1))`,
        expectedOutput: 'Predicted score for 5 hrs: 80.5',
        lineByLine: [
          {
            line: 'model = LinearRegression()',
            explanation: {
              en: 'Creates an untrained linear predictor.',
              hi: 'Ek naya LinearRegression model object banata hai.',
              gu: 'એક નવો LinearRegression મોડેલ ઓબ્જેક્ટ બનાવે છે.',
            },
          },
          {
            line: 'model.fit(X, y)',
            explanation: {
              en: 'Learns the best weight & bias connecting study hours (X) to score (y).',
              hi: 'Study hours (X) aur marks (y) ke beech best formula seekhta hai.',
              gu: 'અભ્યાસના કલાકો (X) અને માર્ક્સ (y) વચ્ચેનો શ્રેષ્ઠ સંબંધ શીખે છે.',
            },
          },
          {
            line: 'model.predict([[5]])',
            explanation: {
              en: 'Predicts the score when a student studies 5 hours.',
              hi: '5 ghante padhai karne par expected score batata hai.',
              gu: '5 કલાકના અભ્યાસ પર અંદાજિત સ્કોરની આગાહી કરે છે.',
            },
          },
        ],
        sandboxPrompt: {
          en: 'Run a pure-Python linear prediction `score = weight * hours + bias` just like `LinearRegression.predict()`.',
          hi: 'Pure Python mein `weight * hours + bias` formula chala kar linear prediction samjhein.',
          gu: 'પ્યોર Python માં `weight * hours + bias` ફોર્મ્યુલાથી લિનિયર પ્રિડિક્શન સમજો.',
        },
        sandboxStarterCode: `weight = 11
bias = 25

def predict_score(hours):
    return weight * hours + bias

print("5 hrs ->", predict_score(5))`,
        sandboxExpectedOutput: '5 hrs -> 80',
        quiz: {
          id: 'quiz-lib-sklearn',
          question: {
            en: 'Which method trains a Scikit-learn model on input features X and target y?',
            hi: 'Scikit-learn mein model ko data par train karne ke liye kaunsa method call karte hain?',
            gu: 'Scikit-learn માં મોડેલને ડેટા પર ટ્રેન કરવા માટે કઈ મેથડ કોલ કરવામાં આવે છે?',
          },
          options: [
            { en: 'model.train(X, y)', hi: 'model.train(X, y)', gu: 'model.train(X, y)' },
            { en: 'model.fit(X, y)', hi: 'model.fit(X, y)', gu: 'model.fit(X, y)' },
            { en: 'model.learn(X, y)', hi: 'model.learn(X, y)', gu: 'model.learn(X, y)' },
          ],
          correctIndex: 1,
          explanation: {
            en: 'Every Scikit-learn estimator uses `.fit(X, y)` for training and `.predict(X)` for inference.',
            hi: 'Scikit-learn ke har model mein training ke liye `.fit(X, y)` use hota hai.',
            gu: 'Scikit-learn ના દરેક મોડેલમાં ટ્રેનિંગ માટે `.fit(X, y)` વપરાય છે.',
          },
        },
      },
      {
        id: 'lib-pytorch',
        name: 'PyTorch',
        pipInstall: 'pip install torch',
        tagline: {
          en: 'Dynamic deep learning framework powering modern LLMs, computer vision, and AI research.',
          hi: 'Modern AI, LLMs aur Computer Vision ki sabse popular deep learning framework.',
          gu: 'આધુનિક AI, LLMs અને કમ્પ્યુટર વિઝન માટેની સૌથી લોકપ્રિય ડીપ લર્નિંગ ફ્રેમવર્ક.',
        },
        whenToUse: {
          en: 'Choose PyTorch when building custom neural networks, fine-tuning open-weight LLMs, or doing image/audio deep learning with GPU acceleration.',
          hi: 'Custom neural networks, image recognition ya AI models fine-tune karne ke liye PyTorch best choice hai.',
          gu: 'કસ્ટમ ન્યુરલ નેટવર્ક્સ, ઇમેજ રેકગ્નિશન અથવા AI મોડેલ્સ ફાઇન-ટ્યુન કરવા માટે PyTorch શ્રેષ્ઠ છે.',
        },
        indiaExample: {
          en: 'Training a regional voice-to-text speech model or crop-disease image detector from leaf photos.',
          hi: 'Fasal ke patton ki photo se rog pehchanne wala AI model ya voice assistant banana.',
          gu: 'પાકના પાંદડાના ફોટા પરથી રોગ ઓળખતું AI મોડેલ અથવા પ્રાદેશિક વોઇસ મોડેલ બનાવવું.',
        },
        keyApis: [
          {
            api: 'torch.tensor([...])',
            purpose: {
              en: 'Creates multi-dimensional GPU-ready arrays with automatic gradient tracking.',
              hi: 'GPU par tez chalne wale arrays (tensors) banata hai.',
              gu: 'GPU પર ઝડપથી ચાલતા મલ્ટિ-ડાયમેન્શનલ ટેન્સર્સ બનાવે છે.',
            },
          },
          {
            api: 'nn.Module & nn.Linear',
            purpose: {
              en: 'Building blocks for neural network layers and forward passes.',
              hi: 'Neural network ki layers define karne ke base classes.',
              gu: 'ન્યુરલ નેટવર્કના લેયર્સ બનાવવા માટેના મુખ્ય બિલ્ડિંગ બ્લોક્સ.',
            },
          },
          {
            api: 'loss.backward() & optimizer.step()',
            purpose: {
              en: 'Computes gradients via backpropagation and updates weights.',
              hi: 'Error calculate karke model ke weights improve karta hai.',
              gu: 'બેકપ્રોપેગેશન દ્વારા ભૂલ ગણીને મોડેલના વેઇટ્સ અપડેટ કરે છે.',
            },
          },
        ],
        productionCode: `import torch
import torch.nn as nn

layer = nn.Linear(in_features=2, out_features=1)
x = torch.tensor([[2.0, 3.0]])
out = layer(x)
print("Output tensor:", out.item())`,
        expectedOutput: 'Output tensor: 0.7412 (weighted linear output)',
        lineByLine: [
          {
            line: 'layer = nn.Linear(in_features=2, out_features=1)',
            explanation: {
              en: 'Creates a neural layer taking 2 inputs and producing 1 weighted output.',
              hi: '2 inputs lene wali aur 1 output dene wali neural layer banata hai.',
              gu: '2 ઇનપુટ લઈને 1 વેઇટેડ આઉટપુટ આપતું ન્યુરલ લેયર બનાવે છે.',
            },
          },
          {
            line: 'x = torch.tensor([[2.0, 3.0]])',
            explanation: {
              en: 'Converts Python list values into a floating-point PyTorch Tensor.',
              hi: 'Numbers ko PyTorch Tensor format mein convert karta hai.',
              gu: 'નંબર્સને PyTorch ટેન્સર ફોર્મેટમાં ફેરવે છે.',
            },
          },
        ],
        sandboxPrompt: {
          en: 'Simulate a single PyTorch `nn.Linear(2, 1)` neuron forward pass (`w1*x1 + w2*x2 + b`) in pure Python.',
          hi: 'Pure Python mein ek PyTorch neuron ka forward pass (`w1*x1 + w2*x2 + b`) run karke dekhein.',
          gu: 'પ્યોર Python માં એક PyTorch ન્યુરોનનો ફોરવર્ડ પાસ (`w1*x1 + w2*x2 + b`) ચલાવી જુઓ.',
        },
        sandboxStarterCode: `x = [2, 3]
weights = [0.5, 1.0]
bias = 1.0

output = x[0] * weights[0] + x[1] * weights[1] + bias
print("Neuron output:", output)`,
        sandboxExpectedOutput: 'Neuron output: 5',
        quiz: {
          id: 'quiz-lib-pytorch',
          question: {
            en: 'In a PyTorch training loop, what does `loss.backward()` do?',
            hi: 'PyTorch training loop mein `loss.backward()` kya karta hai?',
            gu: 'PyTorch ટ્રેનિંગ લૂપમાં `loss.backward()` શું કરે છે?',
          },
          options: [
            { en: 'Deletes the dataset', hi: 'Dataset delete karta hai', gu: 'ડેટાસેટ ડિલીટ કરે છે' },
            { en: 'Computes gradients for all model weights', hi: 'Sabhi weights ke liye gradients calculate karta hai', gu: 'બધા વેઇટ્સ માટે ગ્રેડિયન્ટ્સ ગણે છે' },
            { en: 'Saves the model to GitHub', hi: 'Model GitHub par save karta hai', gu: 'મોડેલ GitHub પર સેવ કરે છે' },
          ],
          correctIndex: 1,
          explanation: {
            en: '`loss.backward()` runs backpropagation to compute how each weight contributed to the error.',
            hi: '`loss.backward()` backpropagation chalakar har weight ka gradient nikalta hai.',
            gu: '`loss.backward()` બેકપ્રોપેગેશન ચલાવીને દરેક વેઇટ માટે ગ્રેડિયન્ટ શોધે છે.',
          },
        },
      },
      {
        id: 'lib-tensorflow',
        name: 'TensorFlow',
        pipInstall: 'pip install tensorflow',
        tagline: {
          en: 'End-to-end deep learning ecosystem with Keras API for fast neural net building and deployment.',
          hi: 'Keras API ke saath complete deep learning platform — models train karne aur mobile/web par deploy karne ke liye.',
          gu: 'Keras API સાથે સંપૂર્ણ ડીપ લર્નિંગ પ્લેટફોર્મ — મોડેલ ટ્રેનિંગ અને મોબાઇલ/વેબ ડિપ્લોયમેન્ટ માટે.',
        },
        whenToUse: {
          en: 'Use TensorFlow + Keras when you want clean `Sequential` layer stacking and easy export to mobile (TFLite) or browser (TF.js).',
          hi: 'Jab aapko clean Keras `Sequential` syntax chahiye aur model ko mobile app ya browser mein deploy karna ho.',
          gu: 'જ્યારે તમને સરળ Keras `Sequential` સિન્ટેક્સ જોઈતી હોય અને મોડેલને મોબાઇલ કે બ્રાઉઝરમાં ચલાવવું હોય.',
        },
        indiaExample: {
          en: 'Running offline handwritten receipt OCR or digit recognition directly inside an Android app via TFLite.',
          hi: 'Android app ke andar bina internet ke handwritten numbers ya bills scan karne wala AI chalana.',
          gu: 'ઇન્ટરનેટ વગર Android એપમાં હેન્ડરિટન બિલ કે અંકો ઓળખતું મોડેલ ચલાવવું.',
        },
        keyApis: [
          {
            api: 'tf.keras.Sequential([...])',
            purpose: {
              en: 'Stacks neural network layers cleanly one after another.',
              hi: 'Neural network ki layers ko ek ke baad ek stack karta hai.',
              gu: 'ન્યુરલ નેટવર્કના લેયર્સને એક પછી એક ક્રમમાં ગોઠવે છે.',
            },
          },
          {
            api: 'model.compile(optimizer, loss)',
            purpose: {
              en: 'Configures how the network learns (e.g., Adam optimizer).',
              hi: 'Optimizer aur loss function set karta hai training se pehle.',
              gu: 'ટ્રેનિંગ પહેલાં ઓપ્ટિમાઇઝર અને લોસ ફંક્શન સેટ કરે છે.',
            },
          },
          {
            api: 'model.fit(x, y, epochs=10)',
            purpose: {
              en: 'Runs training epochs automatically with progress bars.',
              hi: 'Poore dataset par 10 rounds (epochs) tak automatic training chalata hai.',
              gu: 'આખા ડેટાસેટ પર 10 રાઉન્ડ (epochs) સુધી ઓટોમેટિક ટ્રેનિંગ ચલાવે છે.',
            },
          },
        ],
        productionCode: `import tensorflow as tf

model = tf.keras.Sequential([
    tf.keras.layers.Dense(16, activation="relu", input_shape=(4,)),
    tf.keras.layers.Dense(1)
])
model.compile(optimizer="adam", loss="mse")
print("Keras layers ready:", len(model.layers))`,
        expectedOutput: 'Keras layers ready: 2',
        lineByLine: [
          {
            line: 'tf.keras.layers.Dense(16, activation="relu")',
            explanation: {
              en: 'Adds a hidden layer of 16 neurons using ReLU activation (`max(0, x)`).',
              hi: '16 neurons ki hidden layer banata hai jo ReLU (`max(0, x)`) use karti hai.',
              gu: 'ReLU (`max(0, x)`) એક્ટિવેશન સાથે 16 ન્યુરોન્સનું હિડન લેયર ઉમેરે છે.',
            },
          },
          {
            line: 'model.compile(optimizer="adam", loss="mse")',
            explanation: {
              en: 'Prepares the model with Adam optimization and Mean Squared Error loss.',
              hi: 'Training ke liye Adam optimizer aur MSE error metric attach karta hai.',
              gu: 'ટ્રેનિંગ માટે Adam ઓપ્ટિમાઇઝર અને MSE લોસ સેટ કરે છે.',
            },
          },
        ],
        sandboxPrompt: {
          en: 'Practice the ReLU activation function (`max(0, x)`) used inside `Dense(..., activation="relu")` layers.',
          hi: 'Keras Dense layer mein use hone wala `ReLU` activation (`max(0, x)`) Python list par run karein.',
          gu: 'Keras Dense લેયરમાં વપરાતું `ReLU` એક્ટિવેશન (`max(0, x)`) Python લિસ્ટ પર ચલાવો.',
        },
        sandboxStarterCode: `signals = [-3, 0, 4, -1, 7]
activated = []

for val in signals:
    activated.append(max(0, val))

print("After ReLU:", activated)`,
        sandboxExpectedOutput: 'After ReLU: [0, 0, 4, 0, 7]',
        quiz: {
          id: 'quiz-lib-tf',
          question: {
            en: 'What does ReLU activation do to a negative number like `-5`?',
            hi: 'ReLU activation kisi negative number (jaise `-5`) ko kya bana deta hai?',
            gu: 'ReLU એક્ટિવેશન `-5` જેવા નેગેટિવ નંબરને શું બનાવી દે છે?',
          },
          options: [
            { en: 'Turns it into `0`', hi: 'Usse `0` bana deta hai', gu: 'તેને `0` બનાવી દે છે' },
            { en: 'Multiplies it by `10`', hi: '`10` se multiply karta hai', gu: '`10` વડે ગુણાકાર કરે છે' },
            { en: 'Raises an error', hi: 'Error deta hai', gu: 'એરર આપે છે' },
          ],
          correctIndex: 0,
          explanation: {
            en: 'ReLU outputs `max(0, x)`, so any negative value becomes `0`.',
            hi: 'ReLU ka formula `max(0, x)` hai, isliye negative number `0` ho jata hai.',
            gu: 'ReLU નું સૂત્ર `max(0, x)` છે, તેથી કોઈપણ નેગેટિવ વેલ્યુ `0` બની જાય છે.',
          },
        },
      },
    ],
  },
  {
    id: 'web-apis',
    goalTitle: {
      en: 'Web Development & APIs',
      hi: 'Web Development & APIs',
      gu: 'વેબ ડેવલપમેન્ટ અને APIs',
    },
    topLibrariesSummary: 'FastAPI, Django, Flask',
    primaryPurpose: {
      en: 'Building backend web applications and high-speed REST APIs.',
      hi: 'Backend web applications aur high-speed REST APIs banana.',
      gu: 'બેકએન્ડ વેબ એપ્લિકેશન્સ અને હાઇ-સ્પીડ REST APIs બનાવવું.',
    },
    careerRoles: ['Backend Developer', 'Python API Engineer', 'Full-Stack Dev'],
    libraries: [
      {
        id: 'lib-fastapi',
        name: 'FastAPI',
        pipInstall: 'pip install fastapi uvicorn',
        tagline: {
          en: 'Modern, ultra-fast Python API framework with automatic type validation and Swagger `/docs`.',
          hi: 'Modern, super-fast REST API framework — automatic data validation aur live `/docs` page ke saath.',
          gu: 'આધુનિક અને સુપર-ફાસ્ટ REST API ફ્રેમવર્ક — ઓટોમેટિક ટાઇપ વેલિડેશન અને Swagger `/docs` સાથે.',
        },
        whenToUse: {
          en: 'Use FastAPI for high-performance JSON REST APIs, microservices, and serving ML/AI models in production.',
          hi: 'Jab aapko tez JSON REST APIs ya AI/ML model ke backend endpoints banane hon.',
          gu: 'જ્યારે તમારે ઝડપી JSON REST APIs અથવા AI/ML મોડેલના બેકએન્ડ બનાવવા હોય ત્યારે FastAPI વાપરો.',
        },
        indiaExample: {
          en: 'Building an order-tracking microservice or an AI resume-matcher API that handles thousands of requests/sec.',
          hi: 'E-commerce order-tracking API ya AI service endpoint banana jo fast JSON response de.',
          gu: 'ઓર્ડર-ટ્રેકિંગ API અથવા AI સર્વિસ એન્ડપોઇન્ટ બનાવવો જે સેકન્ડમાં હજારો રિક્વેસ્ટ હેન્ડલ કરે.',
        },
        keyApis: [
          {
            api: '@app.get("/items/{id}")',
            purpose: {
              en: 'Defines an HTTP GET endpoint with automatic path parameter parsing.',
              hi: 'URL path parameter ke saath GET API route banata hai.',
              gu: 'URL પેરામીટર સાથે HTTP GET એન્ડપોઇન્ટ બનાવે છે.',
            },
          },
          {
            api: 'class Item(BaseModel)',
            purpose: {
              en: 'Uses Pydantic to validate incoming JSON request bodies.',
              hi: 'Incoming JSON data sahi type ka hai ya nahi, yeh automatic check karta hai.',
              gu: 'આવતા JSON ડેટાનો પ્રકાર અને વેલિડેશન આપમેળે તપાસે છે.',
            },
          },
          {
            api: 'uvicorn main:app --reload',
            purpose: {
              en: 'Runs the async ASGI server locally with auto-reload.',
              hi: 'FastAPI server ko local computer par run karta hai.',
              gu: 'FastAPI સર્વરને લોકલ કમ્પ્યુટર પર ચલાવે છે.',
            },
          },
        ],
        productionCode: `from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Order(BaseModel):
    item: str
    qty: int

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/order")
def create_order(order: Order):
    return {"confirmed": order.item, "qty": order.qty}`,
        expectedOutput: 'GET /health -> {"status": "ok"} | Auto docs at /docs',
        lineByLine: [
          {
            line: 'class Order(BaseModel):',
            explanation: {
              en: 'Guarantees `item` is a string and `qty` is an integer, returning HTTP 422 if invalid.',
              hi: 'Ensure karta hai ki `item` text ho aur `qty` number ho, warna error deta hai.',
              gu: 'ખાતરી કરે છે કે `item` ટેક્સ્ટ હોય અને `qty` નંબર હોય, ખોટા ડેટા પર આપમેળે એરર આપે છે.',
            },
          },
          {
            line: '@app.get("/health")',
            explanation: {
              en: 'Decorator registering a Python function as an HTTP GET route.',
              hi: 'Python function ko ek live web GET route bana deta hai.',
              gu: 'Python ફંક્શનને લાઇવ વેબ GET રૂટ તરીકે રજીસ્ટર કરે છે.',
            },
          },
        ],
        sandboxPrompt: {
          en: 'Write a mini Python route handler dictionary that returns a JSON-style status dictionary for `/health` and `/users`.',
          hi: 'Pure Python mein ek mini API router function likhein jo `/health` ya `/users` route ka response return kare.',
          gu: 'પ્યોર Python માં એક મિની API રાઉટર ફંક્શન લખો જે `/health` અથવા `/users` માટે રિસ્પોન્સ આપે.',
        },
        sandboxStarterCode: `def handle_get(path):
    if path == "/health":
        return {"status": "ok"}
    if path == "/users":
        return {"count": 42}
    return {"error": "404 Not Found"}

print(handle_get("/health"))`,
        sandboxExpectedOutput: "{'status': 'ok'}",
        quiz: {
          id: 'quiz-lib-fastapi',
          question: {
            en: 'Which library does FastAPI use to automatically validate JSON request data?',
            hi: 'FastAPI JSON data ko automatically validate karne ke liye kaunsi library use karta hai?',
            gu: 'FastAPI JSON ડેટાને આપમેળે વેલિડેટ કરવા માટે કઈ લાઇબ્રેરીનો ઉપયોગ કરે છે?',
          },
          options: [
            { en: 'Pydantic', hi: 'Pydantic', gu: 'Pydantic' },
            { en: 'Tkinter', hi: 'Tkinter', gu: 'Tkinter' },
            { en: 'Pygame', hi: 'Pygame', gu: 'Pygame' },
          ],
          correctIndex: 0,
          explanation: {
            en: 'FastAPI relies on Pydantic `BaseModel` classes for fast validation and docs generation.',
            hi: 'FastAPI mein Pydantic `BaseModel` se automatic data validation hota hai.',
            gu: 'FastAPI માં ઓટોમેટિક વેલિડેશન અને ડોક્યુમેન્ટેશન માટે Pydantic `BaseModel` વપરાય છે.',
          },
        },
      },
      {
        id: 'lib-django',
        name: 'Django',
        pipInstall: 'pip install django',
        tagline: {
          en: 'The "batteries-included" full-stack framework with built-in database ORM, Admin UI, and user auth.',
          hi: 'Full-stack "batteries-included" framework — ready-made Admin panel, login system aur database ORM ke saath.',
          gu: 'બિલ્ટ-ઇન ડેટાબેઝ ORM, એડમિન પેનલ અને યુઝર લોગિન સિસ્ટમ સાથેની ફુલ-સ્ટેક ફ્રેમવર્ક.',
        },
        whenToUse: {
          en: 'Choose Django for complete web portals (dashboards, e-commerce, SaaS backends) where you want auth, SQL migrations, and an admin panel out of the box.',
          hi: 'Jab aapko complete website/portal banana ho jisme login, database tables aur Admin dashboard pehle se ready mile.',
          gu: 'જ્યારે તમારે લોગિન, ડેટાબેઝ અને એડમિન ડેશબોર્ડ સાથેની સંપૂર્ણ વેબ એપ બનાવવી હોય ત્યારે Django પસંદ કરો.',
        },
        indiaExample: {
          en: 'Powering EdTech student portals, clinic booking platforms, or Instagram/Razorpay-scale backends.',
          hi: 'EdTech student portal, hospital booking backend ya e-commerce admin system banana.',
          gu: 'એજ્યુકેશન સ્ટુડન્ટ પોર્ટલ, ક્લિનિક બુકિંગ અથવા મોટા સ્કેલના ઇ-કોમર્સ બેકએન્ડ બનાવવા.',
        },
        keyApis: [
          {
            api: 'class Course(models.Model)',
            purpose: {
              en: 'Defines database tables cleanly using Python classes (ORM).',
              hi: 'SQL likhe bina Python class se database table banata hai.',
              gu: 'SQL લખ્યા વગર Python ક્લાસથી ડેટાબેઝ ટેબલ બનાવે છે.',
            },
          },
          {
            api: 'Course.objects.filter(free=True)',
            purpose: {
              en: 'Queries database rows safely in Python.',
              hi: 'Database se matching rows Python mein filter karta hai.',
              gu: 'ડેટાબેઝમાંથી Python વડે સુરક્ષિત રીતે ડેટા ફિલ્ટર કરે છે.',
            },
          },
          {
            api: 'django-admin startproject mysite',
            purpose: {
              en: 'Scaffolds a production-ready Django project folder.',
              hi: 'Turant ek naya Django project setup create karta hai.',
              gu: 'તરત જ નવો Django પ્રોજેક્ટ સ્ટ્રક્ચર તૈયાર કરે છે.',
            },
          },
        ],
        productionCode: `from django.db import models
from django.http import JsonResponse

class Student(models.Model):
    name = models.CharField(max_length=80)
    xp = models.IntegerField(default=0)

def top_students(request):
    top = list(Student.objects.filter(xp__gte=100).values("name", "xp"))
    return JsonResponse({"students": top})`,
        expectedOutput: '{"students": [{"name": "Aarav", "xp": 150}]}',
        lineByLine: [
          {
            line: 'class Student(models.Model):',
            explanation: {
              en: 'Django ORM turns this class into a SQL `Student` table automatically.',
              hi: 'Django ORM is class ko apne aap database table mein badal deta hai.',
              gu: 'Django ORM આ ક્લાસને આપમેળે ડેટાબેઝ ટેબલમાં રૂપાંતરિત કરે છે.',
            },
          },
          {
            line: 'Student.objects.filter(xp__gte=100)',
            explanation: {
              en: 'Reads as `WHERE xp >= 100` in SQL, protecting against SQL injection.',
              hi: 'SQL mein `xp >= 100` wale students safe tareeke se nikalta hai.',
              gu: 'SQL માં `xp >= 100` ધરાવતા વિદ્યાર્થીઓને સુરક્ષિત રીતે શોધે છે.',
            },
          },
        ],
        sandboxPrompt: {
          en: 'Practice Django ORM-style `.filter(xp >= 100)` logic on a Python list of student dictionaries.',
          hi: 'Python list par Django ORM jaisa `xp >= 100` filter logic chala kar dekhein.',
          gu: 'Python લિસ્ટ પર Django ORM જેવું `xp >= 100` ફિલ્ટર લોજિક ચલાવી જુઓ.',
        },
        sandboxStarterCode: `students = [{"name": "Riya", "xp": 140}, {"name": "Dev", "xp": 80}]
top = []

for s in students:
    if s["xp"] >= 100:
        top.append(s["name"])

print("Top:", top)`,
        sandboxExpectedOutput: "Top: ['Riya']",
        quiz: {
          id: 'quiz-lib-django',
          question: {
            en: 'What is a major built-in advantage of Django compared to micro-frameworks?',
            hi: 'Micro-frameworks ke mukable Django ka sabse bada built-in fayda kya hai?',
            gu: 'માઇક્રો-ફ્રેમવર્કની સરખામણીમાં Django નો સૌથી મોટો બિલ્ટ-ઇન ફાયદો શું છે?',
          },
          options: [
            { en: 'Built-in ORM, Auth, and Admin Panel', hi: 'Built-in ORM, Login Auth aur Admin Panel', gu: 'બિલ્ટ-ઇન ORM, લોગિન Auth અને એડમિન પેનલ' },
            { en: 'Only runs in Excel', hi: 'Sirf Excel mein chalta hai', gu: 'ફક્ત Excel માં ચાલે છે' },
            { en: 'Draws 3D video games', hi: '3D games banata hai', gu: '3D ગેમ્સ બનાવે છે' },
          ],
          correctIndex: 0,
          explanation: {
            en: 'Django includes its own ORM, authentication, migrations, and auto-generated Admin panel.',
            hi: 'Django mein ORM, authentication aur admin dashboard sab kuch ready milta hai.',
            gu: 'Django માં ORM, ઓથેન્ટિકેશન અને એડમિન ડેશબોર્ડ પહેલેથી તૈયાર મળે છે.',
          },
        },
      },
      {
        id: 'lib-flask',
        name: 'Flask',
        pipInstall: 'pip install flask',
        tagline: {
          en: 'Lightweight, minimal Python micro-framework ideal for learning web servers and small REST APIs.',
          hi: 'Halka aur simple web micro-framework — web servers seekhne aur chhote APIs turant banane ke liye.',
          gu: 'હળવી અને સરળ વેબ માઇક્રો-ફ્રેમવર્ક — વેબ સર્વર શીખવા અને નાના APIs ઝડપથી બનાવવા માટે.',
        },
        whenToUse: {
          en: 'Pick Flask when you want a 10-line server without heavy boilerplate, or want total freedom to pick your own database library.',
          hi: 'Jab aapko bina zyada setup ke sirf 10 lines mein ek working web server ya API banana ho.',
          gu: 'જ્યારે તમારે વધારે સેટઅપ વગર માત્ર 10 લાઇનમાં વેબ સર્વર કે API બનાવવું હોય ત્યારે Flask વાપરો.',
        },
        indiaExample: {
          en: 'Hosting a college hackathon project backend or a simple webhook receiver on Render/Railway.',
          hi: 'Hackathon project ka backend ya webhook server jaldi se deploy karna.',
          gu: 'હેકાથોન પ્રોજેક્ટનો બેકએન્ડ અથવા સરળ વેબહુક સર્વર ઝડપથી લાઇવ કરવો.',
        },
        keyApis: [
          {
            api: 'app = Flask(__name__)',
            purpose: {
              en: 'Initializes the Flask web application instance.',
              hi: 'Flask web application start karta hai.',
              gu: 'Flask વેબ એપ્લિકેશન ઇન્સ્ટન્સ શરૂ કરે છે.',
            },
          },
          {
            api: '@app.route("/")',
            purpose: {
              en: 'Maps a URL path to a Python view function.',
              hi: 'URL path ko kisi Python function se jodta hai.',
              gu: 'URL પાથને Python ફંક્શન સાથે જોડે છે.',
            },
          },
          {
            api: 'jsonify({...})',
            purpose: {
              en: 'Converts a Python dictionary into a valid JSON HTTP response.',
              hi: 'Python dict ko clean JSON web response mein badalta hai.',
              gu: 'Python ડિક્શનરીને માન્ય JSON HTTP રિસ્પોન્સમાં ફેરવે છે.',
            },
          },
        ],
        productionCode: `from flask import Flask, jsonify

app = Flask(__name__)

@app.route("/api/greet/<name>")
def greet(name):
    return jsonify({"message": "Namaste " + name})

if __name__ == "__main__":
    app.run(port=5000)`,
        expectedOutput: 'GET /api/greet/Priya -> {"message": "Namaste Priya"}',
        lineByLine: [
          {
            line: '@app.route("/api/greet/<name>")',
            explanation: {
              en: 'Captures `<name>` directly from the URL and passes it into `greet(name)`.',
              hi: 'URL se `<name>` pakad kar seedhe `greet(name)` function ko deta hai.',
              gu: 'URL માંથી `<name>` મેળવીને સીધું `greet(name)` ફંક્શનમાં મોકલે છે.',
            },
          },
        ],
        sandboxPrompt: {
          en: 'Write a Flask-style route function `greet(name)` that returns a greeting dictionary.',
          hi: 'Flask route jaisa `greet(name)` function likhein jo greeting message print kare.',
          gu: 'Flask રૂટ જેવું `greet(name)` ફંક્શન લખીને ગ્રીટિંગ ડિક્શનરી પ્રિન્ટ કરો.',
        },
        sandboxStarterCode: `def greet(name):
    return {"message": "Namaste " + name}

print(greet("Aarav"))`,
        sandboxExpectedOutput: "{'message': 'Namaste Aarav'}",
        quiz: {
          id: 'quiz-lib-flask',
          question: {
            en: 'Why is Flask called a "micro-framework"?',
            hi: 'Flask ko "micro-framework" kyun kaha jata hai?',
            gu: 'Flask ને "માઇક્રો-ફ્રેમવર્ક" કેમ કહેવામાં આવે છે?',
          },
          options: [
            { en: 'It keeps the core minimal and lets you add only tools you need', hi: 'Iska core chhota aur simple hai, sirf zaroori tools add karne hote hain', gu: 'તેનો કોર નાનો અને સરળ છે, જરૂરી ટૂલ્સ જ ઉમેરવા પડે છે' },
            { en: 'It can only return 1-byte strings', hi: 'Yeh sirf 1-byte text bhej sakta hai', gu: 'તે ફક્ત 1-બાઇટ ટેક્સ્ટ જ મોકલી શકે છે' },
            { en: 'It does not support URLs', hi: 'Isme URLs nahi hote', gu: 'તેમાં URL સપોર્ટ નથી' },
          ],
          correctIndex: 0,
          explanation: {
            en: 'Flask provides routing and HTTP basics out of the box without forcing a specific database or ORM.',
            hi: 'Flask core mein sirf routing aur HTTP deta hai, baaki tools aap apni marzi se add karte hain.',
            gu: 'Flask ફક્ત જરૂરી રાઉટિંગ અને HTTP આપે છે, બાકીની સુવિધાઓ તમે તમારી પસંદ મુજબ ઉમેરી શકો છો.',
          },
        },
      },
    ],
  },
  {
    id: 'web-scraping',
    goalTitle: {
      en: 'Web Scraping',
      hi: 'Web Scraping',
      gu: 'વેબ સ્ક્રેપિંગ',
    },
    topLibrariesSummary: 'Beautiful Soup & Playwright',
    primaryPurpose: {
      en: 'Extracting data from HTML web pages and automating browser actions.',
      hi: 'HTML web pages se data nikalna aur browser actions automate karna.',
      gu: 'HTML વેબ પેજમાંથી ડેટા કાઢવો અને બ્રાઉઝર એક્શન્સ ઓટોમેટ કરવા.',
    },
    careerRoles: ['Automation Engineer', 'Data Ops Engineer', 'QA Automation Dev'],
    libraries: [
      {
        id: 'lib-bs4',
        name: 'Beautiful Soup',
        pipInstall: 'pip install beautifulsoup4 requests',
        tagline: {
          en: 'Fast, beginner-friendly HTML/XML parser for extracting headings, links, tables, and prices from static pages.',
          hi: 'Static web pages ke HTML se titles, links, tables aur prices nikalne ki sabse aasaan library.',
          gu: 'સ્ટેટિક વેબ પેજના HTML માંથી હેડિંગ, લિંક્સ, ટેબલ અને કિંમતો કાઢવા માટેની સૌથી સરળ લાઇબ્રેરી.',
        },
        whenToUse: {
          en: 'Use Beautiful Soup + `requests` when the data you want is already present in the page HTML (news articles, Wikipedia tables, static listings). Always check `robots.txt` first!',
          hi: 'Jab data seedhe page HTML mein maujood ho (news, tables, static pages). Hamesha website ka `robots.txt` check karein.',
          gu: 'જ્યારે ડેટા સીધો HTML માં હાજર હોય (ન્યૂઝ, ટેબલ્સ વગેરે) ત્યારે વાપરો. હંમેશા `robots.txt` નિયમોનું પાલન કરો.',
        },
        indiaExample: {
          en: 'Collecting public government exam notifications, mandi crop prices, or open scholarship deadlines into a CSV.',
          hi: 'Public scholarship dates ya mandi rate tables ko scrape karke clean Excel/CSV mein save karna.',
          gu: 'જાહેર સ્કોલરશિપ તારીખો અથવા માર્કેટ ભાવના ટેબલને એકત્રિત કરીને CSV માં સેવ કરવું.',
        },
        keyApis: [
          {
            api: 'BeautifulSoup(html, "html.parser")',
            purpose: {
              en: 'Parses raw HTML text into a searchable Python tree.',
              hi: 'Raw HTML text ko searchable tree structure mein badalta hai.',
              gu: 'કાચા HTML ટેક્સ્ટને સર્ચ કરી શકાય તેવા ટ્રીમાં ફેરવે છે.',
            },
          },
          {
            api: 'soup.find("h1").text',
            purpose: {
              en: 'Finds the first matching HTML tag and extracts clean text.',
              hi: 'Pehla matching tag dhoondh kar uske andar ka text nikalta hai.',
              gu: 'પ્રથમ મેચિંગ ટેગ શોધીને તેની અંદરનું ટેક્સ્ટ કાઢે છે.',
            },
          },
          {
            api: 'soup.select(".price")',
            purpose: {
              en: 'Finds all elements matching a CSS selector like `.price`.',
              hi: 'CSS class ya selector se match hone wale sabhi elements ki list deta hai.',
              gu: 'CSS સિલેક્ટર સાથે મેચ થતા બધા એલિમેન્ટ્સની લિસ્ટ આપે છે.',
            },
          },
        ],
        productionCode: `from bs4 import BeautifulSoup

html = "<div class='card'><h2>Laptop</h2><span class='price'>45000</span></div>"
soup = BeautifulSoup(html, "html.parser")

title = soup.find("h2").text
price = soup.select_one(".price").text
print(title, "-> Rs.", price)`,
        expectedOutput: 'Laptop -> Rs. 45000',
        lineByLine: [
          {
            line: 'soup = BeautifulSoup(html, "html.parser")',
            explanation: {
              en: 'Builds a structured DOM tree from raw HTML text.',
              hi: 'HTML string ko parse karke tags dhoondhne ke liye tayyar karta hai.',
              gu: 'HTML સ્ટ્રિંગને પાર્સ કરીને ટેગ શોધવા માટે તૈયાર કરે છે.',
            },
          },
          {
            line: 'soup.find("h2").text',
            explanation: {
              en: 'Strips the `<h2>...</h2>` tags and returns `"Laptop"`.',
              hi: '`<h2>` tags hata kar sirf `"Laptop"` text deta hai.',
              gu: '`<h2>` ટેગ દૂર કરીને માત્ર `"Laptop"` ટેક્સ્ટ આપે છે.',
            },
          },
        ],
        sandboxPrompt: {
          en: 'Extract the text inside `<h2>...</h2>` from an HTML string using Python string slicing/splitting.',
          hi: 'Pure Python mein `<h2>Laptop</h2>` string se tags hata kar andar ka title extract karein.',
          gu: 'પ્યોર Python માં `<h2>Laptop</h2>` સ્ટ્રિંગમાંથી ટેગ દૂર કરીને ટાઇટલ કાઢો.',
        },
        sandboxStarterCode: `html = "<h2>Laptop</h2>"
inner = html.replace("<h2>", "").replace("</h2>", "")
print("Extracted:", inner)`,
        sandboxExpectedOutput: 'Extracted: Laptop',
        quiz: {
          id: 'quiz-lib-bs4',
          question: {
            en: 'Which Beautiful Soup method selects multiple elements using a CSS selector like `.price`?',
            hi: 'CSS selector `.price` se multiple elements nikalne ke liye kaunsa Beautiful Soup method use hota hai?',
            gu: 'CSS સિલેક્ટર `.price` વડે એકથી વધુ એલિમેન્ટ્સ શોધવા કઈ Beautiful Soup મેથડ વપરાય છે?',
          },
          options: [
            { en: 'soup.select(".price")', hi: 'soup.select(".price")', gu: 'soup.select(".price")' },
            { en: 'soup.click(".price")', hi: 'soup.click(".price")', gu: 'soup.click(".price")' },
            { en: 'soup.render(".price")', hi: 'soup.render(".price")', gu: 'soup.render(".price")' },
          ],
          correctIndex: 0,
          explanation: {
            en: '`soup.select()` supports CSS selectors like `.class`, `#id`, and `div > span`.',
            hi: '`soup.select()` CSS selectors jaise `.class` aur `#id` ko support karta hai.',
            gu: '`soup.select()` `.class` અને `#id` જેવા CSS સિલેક્ટર્સને સપોર્ટ કરે છે.',
          },
        },
      },
      {
        id: 'lib-playwright',
        name: 'Playwright',
        pipInstall: 'pip install playwright && playwright install',
        tagline: {
          en: 'Modern browser automation library to click buttons, fill forms, wait for JavaScript, and scrape dynamic SPAs.',
          hi: 'JavaScript websites ke liye modern browser automation — buttons click karna, forms bharna aur dynamic data nikalna.',
          gu: 'JavaScript વેબસાઇટ્સ માટે આધુનિક બ્રાઉઝર ઓટોમેશન — બટન ક્લિક, ફોર્મ ફિલિંગ અને ડાયનેમિક ડેટા સ્ક્રેપિંગ.',
        },
        whenToUse: {
          en: 'Use Playwright when a website loads data dynamically via JavaScript/React (where `requests` gets empty HTML) or when writing automated end-to-end QA tests.',
          hi: 'Jab website React/JS se load hoti ho aur simple `requests` se data na mile, ya automated QA tests likhne hon.',
          gu: 'જ્યારે વેબસાઇટ JavaScript/React થી લોડ થતી હોય અથવા ઓટોમેટેડ QA ટેસ્ટિંગ લખવું હોય ત્યારે Playwright વાપરો.',
        },
        indiaExample: {
          en: 'Automating daily invoice PDF downloads from a web portal or testing checkout flows before every release.',
          hi: 'Web portal se daily reports download automate karna ya e-commerce checkout flow test karna.',
          gu: 'વેબ પોર્ટલ પરથી રોજિંદા ઇન્વોઇસ ડાઉનલોડ ઓટોમેટ કરવા અથવા ચેકઆઉટ ફ્લો ટેસ્ટ કરવો.',
        },
        keyApis: [
          {
            api: 'page.goto("https://...")',
            purpose: {
              en: 'Opens the URL inside a real Chromium/Firefox browser.',
              hi: 'Real browser tab mein website open karta hai.',
              gu: 'રિયલ બ્રાઉઝરમાં વેબસાઇટ URL ઓપન કરે છે.',
            },
          },
          {
            api: 'page.locator("button").click()',
            purpose: {
              en: 'Auto-waits for the button to be visible, then clicks it.',
              hi: 'Button dikhne ka wait karke uspe click karta hai.',
              gu: 'બટન દેખાય ત્યાં સુધી રાહ જોઈને તેના પર ક્લિક કરે છે.',
            },
          },
          {
            api: 'page.screenshot(path="page.png")',
            purpose: {
              en: 'Captures a full screenshot for verification or debugging.',
              hi: 'Poore web page ka screenshot save karta hai.',
              gu: 'વેબ પેજનો સંપૂર્ણ સ્ક્રીનશોટ કેપ્ચર કરે છે.',
            },
          },
        ],
        productionCode: `from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    page.goto("https://example.com")
    print("Page title:", page.title())
    browser.close()`,
        expectedOutput: 'Page title: Example Domain',
        lineByLine: [
          {
            line: 'browser = p.chromium.launch(headless=True)',
            explanation: {
              en: 'Starts a background Chromium browser without opening a visible window.',
              hi: 'Background mein bina window dikhaye Chromium browser start karta hai.',
              gu: 'વિન્ડો ખોલ્યા વગર બેકગ્રાઉન્ડમાં Chromium બ્રાઉઝર શરૂ કરે છે.',
            },
          },
          {
            line: 'page.goto("https://example.com")',
            explanation: {
              en: 'Navigates to the page and runs all JavaScript before reading content.',
              hi: 'Page open karta hai aur poora JavaScript load hone deta hai.',
              gu: 'પેજ ઓપન કરીને સંપૂર્ણ JavaScript લોડ થાય ત્યાં સુધી રાહ જુએ છે.',
            },
          },
        ],
        sandboxPrompt: {
          en: 'Simulate an automated Playwright step sequence (open -> fill -> click -> verify) in pure Python.',
          hi: 'Pure Python mein Playwright jaisa automation workflow step-by-step print karein.',
          gu: 'પ્યોર Python માં Playwright જેવો ઓટોમેશન સ્ટેપ વર્કફ્લો ચલાવી જુઓ.',
        },
        sandboxStarterCode: `steps = ["launch_browser", "goto_login", "fill_user", "click_submit"]

for step in steps:
    print("OK:", step)`,
        sandboxExpectedOutput: `OK: launch_browser\nOK: goto_login\nOK: fill_user\nOK: click_submit`,
        quiz: {
          id: 'quiz-lib-playwright',
          question: {
            en: 'When should you choose Playwright over Beautiful Soup?',
            hi: 'Beautiful Soup ke badle Playwright kab choose karna chahiye?',
            gu: 'Beautiful Soup ને બદલે Playwright ક્યારે પસંદ કરવો જોઈએ?',
          },
          options: [
            { en: 'When the site needs JavaScript execution or button clicks', hi: 'Jab website ko JavaScript load ya button clicks chahiye hon', gu: 'જ્યારે વેબસાઇટને JavaScript લોડ અથવા બટન ક્લિકની જરૂર હોય' },
            { en: 'When editing a local .txt file', hi: 'Sirf local .txt file edit karne ke liye', gu: 'માત્ર લોકલ .txt ફાઇલ એડિટ કરવા માટે' },
            { en: 'When training a PyTorch neural net', hi: 'PyTorch neural network train karne ke liye', gu: 'PyTorch ન્યુરલ નેટવર્ક ટ્રેન કરવા માટે' },
          ],
          correctIndex: 0,
          explanation: {
            en: 'Playwright runs a real browser, making it ideal for JavaScript-rendered pages and interactive flows.',
            hi: 'Playwright real browser chalata hai, isliye JS-rendered pages aur clicks ke liye best hai.',
            gu: 'Playwright રિયલ બ્રાઉઝર ચલાવે છે, તેથી JS-આધારિત પેજ અને ઓટોમેશન માટે શ્રેષ્ઠ છે.',
          },
        },
      },
    ],
  },
];
