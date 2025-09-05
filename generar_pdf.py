#!/usr/bin/env python3
"""
Script para generar PDF de requisitos de Mordipets
"""

try:
    from weasyprint import HTML, CSS
    import os
    
    def generar_pdf():
        # Leer el archivo HTML
        with open('requisitos-mordipets.html', 'r', encoding='utf-8') as file:
            html_content = file.read()
        
        # Crear el HTML object
        html_doc = HTML(string=html_content)
        
        # CSS adicional para mejorar la impresión
        css_content = """
        @page {
            size: A4;
            margin: 2cm;
        }
        
        body {
            font-size: 12px;
            line-height: 1.4;
        }
        
        .container {
            max-width: none;
            margin: 0;
            padding: 0;
            box-shadow: none;
        }
        
        .header {
            page-break-after: avoid;
        }
        
        .section {
            page-break-inside: avoid;
        }
        
        .requirement {
            page-break-inside: avoid;
            margin-bottom: 15px;
        }
        
        .subsection {
            page-break-inside: avoid;
        }
        
        .tech-specs {
            page-break-inside: avoid;
        }
        
        .user-story, .acceptance-criteria {
            page-break-inside: avoid;
        }
        """
        
        # Generar el PDF
        html_doc.write_pdf('Requisitos_Mordipets.pdf', stylesheets=[CSS(string=css_content)])
        print("✅ PDF generado exitosamente: Requisitos_Mordipets.pdf")
        
    if __name__ == "__main__":
        generar_pdf()
        
except ImportError:
    print("❌ WeasyPrint no está instalado.")
    print("📦 Instalando WeasyPrint...")
    
    import subprocess
    import sys
    
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "weasyprint"])
        print("✅ WeasyPrint instalado correctamente.")
        print("🔄 Ejecutando generación de PDF...")
        
        # Reimportar después de la instalación
        from weasyprint import HTML, CSS
        import os
        
        def generar_pdf():
            with open('requisitos-mordipets.html', 'r', encoding='utf-8') as file:
                html_content = file.read()
            
            html_doc = HTML(string=html_content)
            
            css_content = """
            @page {
                size: A4;
                margin: 2cm;
            }
            
            body {
                font-size: 12px;
                line-height: 1.4;
            }
            
            .container {
                max-width: none;
                margin: 0;
                padding: 0;
                box-shadow: none;
            }
            
            .header {
                page-break-after: avoid;
            }
            
            .section {
                page-break-inside: avoid;
            }
            
            .requirement {
                page-break-inside: avoid;
                margin-bottom: 15px;
            }
            
            .subsection {
                page-break-inside: avoid;
            }
            
            .tech-specs {
                page-break-inside: avoid;
            }
            
            .user-story, .acceptance-criteria {
                page-break-inside: avoid;
            }
            """
            
            html_doc.write_pdf('Requisitos_Mordipets.pdf', stylesheets=[CSS(string=css_content)])
            print("✅ PDF generado exitosamente: Requisitos_Mordipets.pdf")
        
        generar_pdf()
        
    except Exception as e:
        print(f"❌ Error instalando WeasyPrint: {e}")
        print("\n📋 Alternativa: Abre el archivo 'requisitos-mordipets.html' en tu navegador y usa Ctrl+P para imprimir como PDF.")
        
except Exception as e:
    print(f"❌ Error generando PDF: {e}")
    print("\n📋 Alternativa: Abre el archivo 'requisitos-mordipets.html' en tu navegador y usa Ctrl+P para imprimir como PDF.")
