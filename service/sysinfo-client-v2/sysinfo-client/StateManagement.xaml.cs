using System;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Windows;
using System.Windows.Media;
using System.Windows.Media.Animation;
using Newtonsoft.Json;
using WebSocketSharp;

namespace sysinfo_client
{
    public partial class StateManagement : Window
    {
        //private readonly string _socketUrl = "ws://157.66.101.178:8080";
        private readonly string _socketUrl = "ws://localhost:8080";
        private WebSocket ws;
        private ObservableCollection<PortItem> ports = new ObservableCollection<PortItem>();
        private bool isClosing = false;

        public StateManagement()
        {
            InitializeComponent();
            PortList.ItemsSource = ports;
            ConnectToWebSocket();
            ReconnectButton.Click += ReconnectButton_Click;
        }

        private void ConnectToWebSocket()
        {
            try
            {
                if (ws != null)
                {
                    ws.Close();
                }

                ws = new WebSocket(_socketUrl);

                ws.OnOpen += (sender, e) =>
                {
                    Dispatcher.Invoke(() =>
                    {
                        ConnectionStatusText.Text = "Trực tuyến";
                        ConnectionStatusIndicator.Fill = Brushes.Green;
                        ReconnectButton.IsEnabled = false;
                    });
                };

                ws.OnMessage += (sender, e) =>
                {
                    Dispatcher.Invoke(() =>
                    {
                        try
                        {
                            var data = JsonConvert.DeserializeObject<SystemInfo>(e.Data);
                            UpdateUI(data);
                        }
                        catch (Exception ex)
                        {
                            MessageBox.Show($"Lỗi phân tích dữ liệu: {ex.Message}", "Lỗi dữ liệu", MessageBoxButton.OK, MessageBoxImage.Error);
                        }
                    });
                };

                ws.OnError += (sender, e) =>
                {
                    if (!isClosing)
                    {
                        Dispatcher.Invoke(() =>
                        {
                            ConnectionStatusText.Text = $"Lỗi: {e.Message}";
                            ConnectionStatusIndicator.Fill = Brushes.Red;
                            ReconnectButton.IsEnabled = true;
                            ResetUI();
                        });
                    }
                };

                ws.OnClose += (sender, e) =>
                {
                    if (!isClosing)
                    {
                        Dispatcher.Invoke(() =>
                        {
                            ConnectionStatusText.Text = "Ngoại tuyến";
                            ConnectionStatusIndicator.Fill = Brushes.Red;
                            ReconnectButton.IsEnabled = true;
                            ResetUI();
                        });
                    }
                };

                ws.Connect();
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Lỗi kết nối: {ex.Message}", "Lỗi kết nối", MessageBoxButton.OK, MessageBoxImage.Error);
                ConnectionStatusText.Text = "Không thể kết nối";
                ConnectionStatusIndicator.Fill = Brushes.Red;
                ReconnectButton.IsEnabled = true;
                ResetUI();
            }
        }

        private void ReconnectButton_Click(object sender, RoutedEventArgs e)
        {
            ConnectionStatusText.Text = "Đang kết nối...";
            ConnectionStatusIndicator.Fill = Brushes.Orange;
            ConnectToWebSocket();
        }

        private void UpdateUI(SystemInfo data)
        {
            try
            {
                AnimateValue(CpuProgress, CpuProgress.Value, data.CpuUsage);
                AnimateTextValue(CpuUsageText, data.CpuUsage, "%");
                CpuMinUsageText.Text = $"{data.CpuMinUsage:F1}%".Replace(".", ",");
                CpuMaxUsageText.Text = $"{data.CpuMaxUsage:F1}%".Replace(".", ",");
                CpuProgress.Foreground = GetBrush(data.CpuUsage);

                AnimateValue(RamProgress, RamProgress.Value, data.RamUsagePercent);
                AnimateTextValue(RamUsageText, data.RamUsagePercent, "%");
                RamMinUsageText.Text = $"{data.RamMinUsage:N1} MB".Replace(".", ",");
                RamMaxUsageText.Text = $"{data.RamMaxUsage:N1} MB".Replace(".", ",");
                RamProgress.Foreground = GetBrush(data.RamUsagePercent);

                AnimateValue(DiskProgress, DiskProgress.Value, data.DiskUsagePercent);
                AnimateTextValue(DiskUsageText, data.DiskUsagePercent, "%");
                DiskMinUsageText.Text = $"{data.DiskMinUsage:N1} MB".Replace(".", ",");
                DiskMaxUsageText.Text = $"{data.DiskMaxUsage:N1} MB".Replace(".", ",");
                DiskProgress.Foreground = GetBrush(data.DiskUsagePercent);

                ports.Clear();
                foreach (var port in data.Ports)
                {
                    ports.Add(new PortItem
                    {
                        Port = port.Port,
                        DisplayName = port.DisplayName,
                        Status = port.IsActive ? "Hoạt động" : "Không hoạt động",
                        StatusColor = port.IsActive ? Brushes.Green : Brushes.Red,
                        CpuUsagePercent = port.CpuUsagePercent,
                        RamUsageMb = port.RamUsageMb,
                        NetworkUsageMb = port.NetworkUsageMb
                    });
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Lỗi cập nhật giao diện: {ex.Message}", "Lỗi cập nhật UI", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        private void ResetUI()
        {
            AnimateValue(CpuProgress, CpuProgress.Value, 0);
            AnimateTextValue(CpuUsageText, 0, "%");
            CpuMinUsageText.Text = "0,0%";
            CpuMaxUsageText.Text = "0,0%";
            CpuProgress.Foreground = Brushes.Gray;

            AnimateValue(RamProgress, RamProgress.Value, 0);
            AnimateTextValue(RamUsageText, 0, "%");
            RamMinUsageText.Text = "0,0 MB";
            RamMaxUsageText.Text = "0,0 MB";
            RamProgress.Foreground = Brushes.Gray;

            AnimateValue(DiskProgress, DiskProgress.Value, 0);
            AnimateTextValue(DiskUsageText, 0, "%");
            DiskMinUsageText.Text = "0,0 MB";
            DiskMaxUsageText.Text = "0,0 MB";
            DiskProgress.Foreground = Brushes.Gray;

            ports.Clear();
        }

        private void AnimateValue(System.Windows.Controls.ProgressBar progressBar, double oldValue, double newValue)
        {
            DoubleAnimation animation = new DoubleAnimation
            {
                From = oldValue,
                To = newValue,
                Duration = TimeSpan.FromMilliseconds(500),
                EasingFunction = new QuadraticEase { EasingMode = EasingMode.EaseOut }
            };
            progressBar.BeginAnimation(System.Windows.Controls.ProgressBar.ValueProperty, animation);
        }

        private void AnimateTextValue(System.Windows.Controls.TextBlock textBlock, float newValue, string suffix)
        {
            string currentText = textBlock.Text.Replace(",", ".").Replace("%", "").Replace("MB", "").Trim();
            float currentValue = 0;
            float.TryParse(currentText, out currentValue);

            var duration = TimeSpan.FromMilliseconds(500);
            var frame = 20.0;
            var totalFrames = (int)(duration.TotalMilliseconds / frame);
            var valueIncrement = (newValue - currentValue) / totalFrames;

            var animation = new System.Windows.Media.Animation.DoubleAnimation
            {
                From = 0,
                To = totalFrames,
                Duration = duration
            };

            animation.Completed += (s, e) =>
            {
                textBlock.Text = $"{newValue:F1}{suffix}".Replace(".", ",");
            };

            int frameCount = 0;

            CompositionTarget.Rendering += AnimateTextFrames;

            void AnimateTextFrames(object sender, EventArgs e)
            {
                if (frameCount > totalFrames)
                {
                    CompositionTarget.Rendering -= AnimateTextFrames;
                    return;
                }

                float animatedValue = currentValue + (valueIncrement * frameCount);
                textBlock.Text = $"{animatedValue:F1}{suffix}".Replace(".", ",");
                frameCount++;
            }
        }

        private SolidColorBrush GetBrush(float percentage)
        {
            if (percentage < 50) return new SolidColorBrush(Color.FromRgb(76, 175, 80));
            if (percentage < 80) return new SolidColorBrush(Color.FromRgb(255, 152, 0));
            return new SolidColorBrush(Color.FromRgb(244, 67, 54));
        }

        private void Window_Closing(object sender, CancelEventArgs e)
        {
            isClosing = true;
            if (ws != null && ws.ReadyState == WebSocketState.Open)
            {
                ws.Close();
            }
        }

        private void StateManagement_OnClosed(object sender, EventArgs e)
        {
            Environment.Exit(0);
        }
    }

    public class SystemInfo
    {
        [JsonProperty("cpu_min_usage")]
        public float CpuMinUsage { get; set; }

        [JsonProperty("cpu_max_usage")]
        public float CpuMaxUsage { get; set; }

        [JsonProperty("cpu_usage")]
        public float CpuUsage { get; set; }

        [JsonProperty("ram_min_usage")]
        public ulong RamMinUsage { get; set; }

        [JsonProperty("ram_max_usage")]
        public ulong RamMaxUsage { get; set; }

        [JsonProperty("ram_usage_percent")]
        public float RamUsagePercent { get; set; }

        [JsonProperty("disk_min_usage")]
        public ulong DiskMinUsage { get; set; }

        [JsonProperty("disk_max_usage")]
        public ulong DiskMaxUsage { get; set; }

        [JsonProperty("disk_usage_percent")]
        public float DiskUsagePercent { get; set; }

        [JsonProperty("network_received")]
        public ulong NetworkReceived { get; set; }

        [JsonProperty("network_transmitted")]
        public ulong NetworkTransmitted { get; set; }

        [JsonProperty("ports")]
        public PortStatus[] Ports { get; set; }
    }

    public class PortStatus
    {
        [JsonProperty("port")]
        public ushort Port { get; set; }

        [JsonProperty("display_name")]
        public string DisplayName { get; set; }

        [JsonProperty("is_active")]
        public bool IsActive { get; set; }

        [JsonProperty("cpu_usage_percent")]
        public float CpuUsagePercent { get; set; }

        [JsonProperty("ram_usage_mb")]
        public ulong RamUsageMb { get; set; }

        [JsonProperty("network_usage_mb")]
        public ulong NetworkUsageMb { get; set; }
    }

    public class PortItem
    {
        public ushort Port { get; set; }
        public string DisplayName { get; set; }
        public string Status { get; set; }
        public SolidColorBrush StatusColor { get; set; }
        public float CpuUsagePercent { get; set; }
        public ulong RamUsageMb { get; set; }
        public ulong NetworkUsageMb { get; set; }
    }
}