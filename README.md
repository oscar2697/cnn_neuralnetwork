# 🎵 Audio CNN - Sound Classification System

A comprehensive audio classification system using Convolutional Neural Networks (CNN) with ResNet architecture for environmental sound classification on the ESC-50 dataset. This project includes both training pipeline and a real-time inference web interface.

## 🌟 Features

- **Deep Learning Model**: ResNet-based CNN architecture optimized for audio spectrograms
- **ESC-50 Dataset**: 50 environmental sound categories classification
- **Real-time Inference**: Fast API endpoint for audio classification
- **Interactive Frontend**: Modern React interface with visualizations
- **Feature Map Visualization**: See what the CNN learns at each layer
- **Audio Processing**: Mel-spectrogram transformation and data augmentation
- **Cloud Deployment**: Modal.com integration for scalable training and inference

## 🏗️ Architecture

### Backend (Python)
- **Model Architecture**: ResNet-based CNN with residual blocks
- **Audio Processing**: Mel-spectrogram conversion using torchaudio
- **Training**: Mixed precision training with data augmentation
- **Deployment**: Modal.com serverless functions

### Frontend (TypeScript/React)
- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **Components**: Modular React components for visualization
- **File Upload**: Drag-and-drop audio file interface

## 📊 Dataset

**ESC-50** (Environmental Sound Classification)
- 50 sound categories
- 2000 audio clips (5 seconds each)
- 44.1 kHz sampling rate
- Cross-validation with 5 folds

### Sound Categories Include:
🐕 Animals (dog, cat, pig, cow, frog, etc.)  
🌧️ Natural sounds (rain, sea waves, wind, thunder, etc.)  
👶 Human sounds (crying baby, coughing, laughing, etc.)  
🚗 Urban sounds (car horn, siren, train, airplane, etc.)  
🏠 Domestic sounds (door knock, vacuum cleaner, etc.)  

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 18+
- CUDA-capable GPU (recommended)
- Modal account for cloud deployment

### Backend Setup

1. **Clone the repository**
```bash
git clone https://github.com/your-username/audio-cnn.git
cd audio-cnn
```

2. **Install Python dependencies**
```bash
pip install -r requirements.txt
```

3. **Setup Modal (for cloud training/inference)**
```bash
pip install modal
modal token new  # Follow authentication steps
```

4. **Train the model**
```bash
python -m modal run train.py
```

5. **Deploy inference API**
```bash
python -m modal run main.py
```

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

4. **Open browser**
Navigate to `http://localhost:3000`

## 🧠 Model Architecture

### ResNet-Based CNN
```
Input: Mel-Spectrogram (1 x 128 x Time)
├── Initial Conv Layer (7x7, stride=2)
├── Layer 1: 3x ResidualBlocks (64 channels)
├── Layer 2: 4x ResidualBlocks (128 channels)
├── Layer 3: 6x ResidualBlocks (256 channels)
├── Layer 4: 3x ResidualBlocks (512 channels)
├── Global Average Pooling
├── Dropout (0.5)
└── Fully Connected (50 classes)
```

### Training Features
- **Data Augmentation**: Frequency/Time masking, Mixup
- **Optimization**: AdamW with OneCycleLR scheduling
- **Regularization**: Label smoothing, dropout, weight decay
- **Monitoring**: TensorBoard logging

## 🎨 Frontend Components

### Core Components
- **`FeatureMap.tsx`**: Visualizes CNN feature maps as heatmaps
- **`Waveform.tsx`**: Displays audio waveform visualization
- **`ColorScale.tsx`**: Color legend for feature map interpretation
- **`Progress.tsx`**: Confidence score visualization

### Features
- **File Upload**: Drag-and-drop WAV file interface
- **Real-time Processing**: Live audio classification
- **Feature Visualization**: CNN layer outputs as interactive heatmaps
- **Top Predictions**: Confidence scores with emojis
- **Responsive Design**: Works on desktop and mobile

## 📁 Project Structure

```
audio_cnn/
├── 📂 backend/
│   ├── 📜 train.py          # Training pipeline with Modal
│   ├── 📜 main.py           # Inference API endpoint
│   ├── 📜 model.py          # CNN architecture definition
│   └── 📜 requirements.txt  # Python dependencies
├── 📂 frontend/
│   ├── 📂 src/
│   │   ├── 📂 app/
│   │   │   ├── 📜 layout.tsx
│   │   │   └── 📜 page.tsx
│   │   ├── 📂 components/
│   │   │   ├── 📂 ui/       # Shadcn components
│   │   │   ├── 📜 ColorScale.tsx
│   │   │   ├── 📜 FeatureMap.tsx
│   │   │   └── 📜 Waveform.tsx
│   │   ├── 📂 lib/
│   │   │   ├── 📜 colors.ts  # Color mapping functions
│   │   │   ├── 📜 emoji.ts   # Sound category emojis
│   │   │   ├── 📜 types.ts   # TypeScript definitions
│   │   │   └── 📜 utils.ts   # Utility functions
│   │   └── 📂 styles/
│   │       └── 📜 globals.css
│   ├── 📜 package.json
│   ├── 📜 next.config.js
│   └── 📜 tailwind.config.js
└── 📜 README.md
```

## 🔬 Technical Details

### Audio Processing Pipeline
1. **Input**: WAV file (any sample rate)
2. **Preprocessing**: Resample to 44.1kHz, convert to mono
3. **Feature Extraction**: Mel-spectrogram (128 mel bins)
4. **Normalization**: Amplitude to dB conversion
5. **Model Input**: Normalized spectrogram tensor

### Model Performance
- **Dataset**: ESC-50 (50 classes, 2000 samples)
- **Validation Split**: Fold 5 (400 samples)
- **Training**: Folds 1-4 (1600 samples)
- **Expected Accuracy**: ~85-90% on validation set

### API Response Format
```json
{
  "predictions": [
    {
      "class": "chirping_birds",
      "confidence": 0.89
    }
  ],
  "visualizations": {
    "layer1": {
      "shape": [64, 32, 87],
      "values": [[...]]
    }
  },
  "input_spectogram": {
    "shape": [128, 87],
    "values": [[...]]
  },
  "waveform": {
    "values": [...],
    "sample_rate": 44100,
    "duration": 5.0
  }
}
```

## 🛠️ Development

### Adding New Sound Categories
1. Prepare dataset with new categories
2. Update `emoji.ts` with category emoji mappings
3. Retrain model with updated class count
4. Deploy updated model

### Customizing Visualizations
- Modify `colors.ts` for different color schemes
- Adjust `FeatureMap.tsx` for different heatmap styles
- Update `Waveform.tsx` for custom waveform rendering

## 📊 Monitoring & Logging

- **Training**: TensorBoard logs saved to `/models/tensorboard_logs/`
- **Model Checkpoints**: Best model saved as `/models/best_model.pth`
- **Inference**: Real-time processing metrics via Modal dashboard

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **ESC-50 Dataset**: Environmental Sound Classification dataset
- **Modal.com**: Serverless GPU compute platform
- **PyTorch**: Deep learning framework
- **Next.js**: React framework for production
- **Tailwind CSS**: Utility-first CSS framework

## 📞 Contact

- **GitHub**: [@your-username](https://github.com/your-username)
- **Email**: your.email@example.com

---

### 🚀 Ready to classify some sounds? Upload a WAV file and watch the magic happen!
