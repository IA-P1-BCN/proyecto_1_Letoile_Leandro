def show_instructions():
    print("\n🚕 TaxiTech Solutions — Taxímetro Digital")
    print("------------------------------------------")
    print("Comandos disponibles:")
    print("  start  → iniciar una carrera")
    print("  quit   → salir del programa")


def main():
    print("🚕 Bienvenido al Taxímetro Digital")

    while True:
        show_instructions()
        command = input("\n> ").strip().lower()

        if command == "start":
            print("\n🚕 Carrera iniciada")
        elif command == "quit":
            print("\n👋 Programa finalizado")
            break
        else:
            print("\n❌ Comando no válido")


if __name__ == "__main__":
    main()